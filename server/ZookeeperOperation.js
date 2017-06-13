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
const QS = require('querystring');
const MAX_DEEP = 6;
const ZookeeperOperation = class ZookeeperOperation {
    constructor() {
        this.client = zookeeper.createClient(config.zookeeper, config.zookeeperOption || {});
        this.client.connect();
        this.cacheUrl = new Map();
        this.service = [];
        this.provider = [];
        this.consumer = [];
        this.address = [];
        this.configurator = [];
        this.router = [];
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
        this.service = [];
        this.provider = [];
        this.consumer = [];
        this.address = [];
        this.configurator = [];
        this.router = [];
        let uniqueService = new Set();
        let uniqueProvider = new Set();
        let uniqueConsumer = new Set();
        let uniqueAddress = new Set();
        let uniqueConfigurator = new Set();
        let uniqueRouter = new Set();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value) || !value.length) continue;
            let split = key.split('/');
            if (minimatch(key, `/${config.root}/*`)) {
                value.forEach(v => {
                    if (!uniqueService.has(v)) {
                        uniqueService.add(v);
                        this.service.push({
                            name: v,
                            namespace: split[2]
                        });
                    }
                });
            } else if (minimatch(key, `/${config.root}/*/*/*/providers`)) {
                value.forEach(v => {
                    let p = QS.parse(v);
                    p.namespace = split[2];
                    p.service = split[3];
                    p.version = split[4];
                    p.status = true;
                    p._url = v;
                    if (!uniqueProvider.has(v)) {
                        uniqueProvider.add(v);
                        this.provider.push(p);
                    }
                    let address = `${p.host}:${p.port}`;
                    if (!uniqueAddress.has(address)) {
                        uniqueAddress.add(address);
                        this.address.push({
                            value: address,
                            own: '生产者'
                        });
                    }
                });
            } else if (minimatch(key, `/${config.root}/*/*/*/consumers`)) {
                value.forEach(v => {
                    let p = QS.parse(v);
                    p.namespace = split[2];
                    p.service = split[3];
                    p.version = split[4];
                    p.status = true;
                    p.shield = false;
                    p._url = v;
                    if (!uniqueConsumer.has(v)) {
                        uniqueConsumer.add(v);
                        this.consumer.push(p);
                    }
                    if (!uniqueAddress.has(p.host)) {
                        uniqueAddress.add(p.host);
                        this.address.push({
                            value: p.host,
                            own: '消费者'
                        });
                    }
                });
            } else if (minimatch(key, `/${config.root}/*/*/*/configurators`)) {
                value.forEach(v => {
                    let p = QS.parse(v);
                    p.namespace = split[2];
                    p.service = split[3];
                    p.version = split[4];
                    p._url = v;
                    if (!uniqueConfigurator.has(v)) {
                        uniqueConfigurator.add(v);
                        this.configurator.push(p);
                    }
                });
            } else if (minimatch(key, `/${config.root}/*/*/*/routers`)) {
                value.forEach(v => {
                    let p = QS.parse(v);
                    p.namespace = split[2];
                    p.service = split[3];
                    p.version = split[4];
                    p._url = v;
                    if (!uniqueRouter.has(v)) {
                        uniqueRouter.add(v);
                        this.router.push(p);
                    }
                });
            }
        }
        await this.checkProviderStatus();
        await this.checkConsumerStatus();
    }

    async checkProviderStatus() {
        for (let c of this.configurator) {
            if (c.disabled) {
                let array = c.disabled.split(',');
                for (let a of array) {
                    for (let p of this.provider) {
                        (`${p.host}:${p.port}` === a && this.isSame(p, c)) && (p.status = false);
                    }
                }
            }
            if (c.override) {
                for (let p of this.provider) {
                    (`${p.host}:${p.port}` === c.override && this.isSame(p, c)) && Reflect.ownKeys(p).forEach(key => {
                        c[key] !== undefined && (p[key] = c[key]);
                    });
                }
            }
        }
    }

    async checkConsumerStatus() {
        for (let c of this.configurator) {
            if (c['consumer_disabled']) {
                let array = c['consumer_disabled'].split(',');
                for (let a of array) {
                    for (let p of this.consumer) {
                        (`${p.host}` === a && this.isSame(p, c)) && (p.status = false);
                    }
                }
            }
            if (c['shielded']) {
                let array = c['shielded'].split(',');
                for (let a of array) {
                    for (let p of this.consumer) {
                        (`${p.host}` === a && this.isSame(p, c)) && (p.shield = true);
                    }
                }
            }
        }

        for (let r of this.router) {
            for (let p of this.consumer) {
                (minimatch(p.host, r.consumeHost) && this.isSame(p, r)) && (p.router = r);
            }
        }
    }

    async override(namespace, service, version, address, props) {
        for (let config of this.configurator) {
            if (config.override && config.override === address) {
                await this.remove(namespace, service, version, 'configurators', config._url);
            }
        }
        if (!props) {
            return;
        }
        Object.keys(props).forEach(key => {props[key] === '' && Reflect.deleteProperty(props, key)});
        let config = Object.assign({override: address}, props);
        config._url = QS.stringify(config, null, null, {encodeURIComponent: (str) => {return str;}});
        await this.create(namespace, service, version, 'configurators', config._url);
    }

    async addRouter(namespace, service, version, value) {
        let stringify = QS.stringify(value, null, null, {encodeURIComponent: (str) => {return str;}});
        for(let r of this.router) {
            if (r._url === stringify) {
                throw new Error('已经存在');
            }
        }
        await this.create(namespace, service, version, 'routers', value);
    }

    async removeRouter(namespace, service, version, value) {
        await this.remove(namespace, service, version, 'routers', value);
    }

    async create(namespace, service, version, path, value) {
        value = typeof value === 'object' ? QS.stringify(value, null, null, {encodeURIComponent: (str) => {return str;}}) : value;
        await pify(this.client.mkdirp).apply(this.client, [`/${config.root}/${namespace}/${service}/${version}/${path}/${value}`, null]);
    }
    async remove(namespace, service, version, path, value) {
        value = typeof value === 'object' ? QS.stringify(value, null, null, {encodeURIComponent: (str) => {return str;}}) : value;
        await pify(this.client.remove).apply(this.client, [`/${config.root}/${namespace}/${service}/${version}/${path}/${value}`, -1]);
    }

    async getConfigurators(namespace = '*', service = '*', version = '*') {
        let result = new Set();
        for (let [key, value] of this.cacheUrl) {
            if (!value || !Array.isArray(value) || !minimatch(key, `/${config.root}/${namespace}/${service}/${version}/configurators`)) continue;
            let split = key.split('/');
            for (let v of value) {
                result.add(`${v}&namespace=${split[2]}&service=${split[3]}&version=${split[4]}`);
            }
        }
        return result;
    }

    isSame(a, b) {
        return a.namespace === b.namespace && a.version === b.version && a.service === b.service;
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