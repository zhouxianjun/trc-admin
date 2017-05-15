/**
 * Created by alone on 17-5-15.
 */
'use strict';
const logger = require('tracer-logger');
const zookeeper = require('node-zookeeper-client');
const config = require('../config.json');
const pify = require('pify');
const listeners = {
    name: 'namespace',
    children: {
        name: 'service',
        parent: 'namespace',
        children: {
            name: 'version',
            parent: 'service',
        }
    }
};
const ZookeeperOperation = class ZookeeperOperation {
    constructor() {
        this.client = zookeeper.createClient(config.zookeeper, config.zookeeperOption || {});
        this.client.connect();
        this.cache = new Map();
        this.namespace = new Map();
        this.service = new Map();
        this.version = new Map();
        logger.info(`zookeeper connect for ${config.zookeeper}`);

        // listener root
        (async () => {
            let namespaces = await this.listener(`/${config.root}`);
            if (namespaces && Array.isArray(namespaces)) {
                await this.onNamespace(namespaces);
            }
        })();
    }

    async listener(url) {
        await pify(this.client.mkdirp).apply(this.client, [url, null]);
        return await pify(this.client.getChildren).apply(this.client, [url, async () => {
            let children = await this.listener(url);
            if (Array.isArray(children)) {
                this.cache.set(url, children);
            }
        }]);
    }

    async onNamespace(namespaces) {
        await this.watcher(namespaces, 'namespace', `/${config.root}`);
    }

    async watcher(children, type, parent) {
        if (this[type] instanceof Map) {
            // clear
            for (let child of this[type]) {
                if (!children.includes(child)) {
                    this[type].delete(child);
                    logger.info(`removed ${type} ${child}`);
                }
            }
            // add
            for (let child of children) {
                if (!this[type].has(child)) {
                    this[type].set(child, `${parent}/${child}`);
                    let services = await this.listener(`${parent}/${child}`);
                    logger.info(`add ${type} ${child}`);
                    if (services && Array.isArray(services)) {
                        await this.watcher(services, 'service', `/${config.root}/${child}`);
                    }
                }
            }
        }
    }
};