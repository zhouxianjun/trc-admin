/**
 * Created by alone on 17-5-15.
 */
'use strict';
const logger = require('tracer-logger');
const zookeeper = require('node-zookeeper-client');
const config = require('../config.json');
const pify = require('pify');
const minimatch = require('minimatch');
const util = require('util');
const MAX_DEEP = 6;
const QS = require('querystring');
const ZookeeperOperation = class ZookeeperOperation {
    constructor() {
        this.client = zookeeper.createClient(config.zookeeper, config.zookeeperOption || {});
        this.client.connect();
        this.cacheUrl = new Map();
        this.cache = [{
            name: 'namespace',
            pos: 2,
            value: new Set()
        }, {
            name: 'service',
            pos: 3,
            value: new Set()
        }, {
            name: 'version',
            pos: 4,
            value: new Set()
        }];
        logger.info(`zookeeper connect for ${config.zookeeper}`);

        // listener root
        (async () => {
            await this.listener(`/${config.root}`);
        })();
    }

    async listener(url) {
        await pify(this.client.mkdirp).apply(this.client, [url, null]);
        let urlSplit = url.split('/');
        if (urlSplit.length > MAX_DEEP) return;
        logger.info(`listener url ${url}`);
        let children = await pify(this.client.getChildren).apply(this.client, [url, async () => {
            await this.listener(url);
        }]);
        this.cacheUrl.set(url, children);
        if (Array.isArray(children)) {
            for (let child of children) {
                await this.listener(`${url}/${child}`);
            }
            logger.debug(`cache url ${url} change ${util.inspect(this.cacheUrl)}`);
        }
        await this.parse();
    }

    async parse() {
        await this.clearCache();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value)) continue;
            let split = key.split('/').length;
            for (let c of this.cache) {
                if (c.pos === split) {
                    for (let v of value) {
                        c.value.add(v);
                    }
                }
            }
        }
    }

    async clearCache() {
        for (let c of this.cache) {
            c.value.clear();
        }
    }

    async disable(namespace, service, version, address) {
        address = {disabled: address};
        await pify(this.client.mkdirp).apply(this.client, [`/${config.root}/${namespace}/${service}/${version}/configurators/${QS.stringify(address, null, null, {encodeURIComponent: (str) => {return str;}})}`, null]);
    }

    get namespace() {
        return this.cache[0].value;
    }

    getServices(namespace = '*', service = '*') {
        let result = new Set();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value) || !minimatch(key, `/${config.root}/${namespace}`)) continue;
            for (let v of value) {
                if (!minimatch(v, service)) continue;
                result.add(v);
            }
        }
        return result;
    }

    get version() {
        return this.cache[2].value;
    }

    getProviders(namespace = '*', service = '*', version = '*') {
        let result = new Set();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value) || !minimatch(key, `/${config.root}/${namespace}/${service}/${version}/providers`)) continue;
            let split = key.split('/');
            for (let v of value) {
                result.add(`${v}&namespace=${split[2]}&service=${split[3]}&version=${split[4]}`);
            }
        }
        return result;
    }

    getConsumers(namespace = '*', service = '*', version = '*') {
        let result = new Set();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value) || !minimatch(key, `/${config.root}/${namespace}/${service}/${version}/consumers`)) continue;
            let split = key.split('/');
            for (let v of value) {
                result.add(`${v}&namespace=${split[2]}&service=${split[3]}&version=${split[4]}`);
            }
        }
        return result;
    }
};

module.exports = new ZookeeperOperation();