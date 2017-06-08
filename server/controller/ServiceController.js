/**
 * Created by alone on 17-5-15.
 */
'use strict';
const ZookeeperOperation = require('../ZookeeperOperation');
const Utils = require('../Utils');
const Result = require('../dto/Result');
module.exports = class ServiceController {
    static get routers() {
        return [{
            method: 'get',
            path: '/service/provider/list',
            value: ServiceController.providers
        }, {
            method: 'get',
            path: '/service/disable',
            value: ServiceController.disable
        }];
    }
    static async list(ctx) {
        let providers = ZookeeperOperation.getProviders(ctx.query.namespace, ctx.query.service, ctx.query.version);
        let consumers = ZookeeperOperation.getConsumers(ctx.query.namespace, ctx.query.service, ctx.query.version);
        let configurators = ZookeeperOperation.getConfigurators(ctx.query.namespace, ctx.query.service, ctx.query.version);
        let ps = Utils.urlParse(providers);
        let cs = Utils.urlParse(consumers);
        let configs = Utils.urlParse(configurators);
        let configMap = new Map();
        let result = new Map();
        for (let config of configs) {
            let key = `${config.namespace}/${config.service}/${config.version}`;
            if (!configMap.has(key)) {
                configMap.set(key, config);
            }
        }
        for (let p of ps) {
            let key = `${p.namespace}/${p.service}/${p.version}`;
            if (!result.has(key)) {
                result.set(key, {
                    providers: [p],
                    consumers: [],
                    service: p.service,
                    namespace: p.namespace,
                    version: p.version
                });
                continue;
            }
            let config = configMap.get(key);
            p.disabled = config && config.disabled === `${p.host}:${p.port}`;
            result.get(key).providers.push(p);
        }
        for (let c of cs) {
            let key = `${c.namespace}/${c.service}/${c.version}`;
            if (!result.has(key)) {
                result.set(key, {
                    consumers: [c]
                });
                continue;
            }
            result.get(key).consumers.push(c);
        }
        ctx.body = [...result.values()];
    }

    static async providers(ctx) {
        let urls = ZookeeperOperation.getProviders(ctx.query.namespace, ctx.query.service, ctx.query.version);
        ctx.body = new Result(true, {
            key: 'list',
            value: Utils.urlParse(urls)
        }).json;
    }

    static async consumers(ctx) {
        ctx.body = [...ZookeeperOperation.getConsumers(ctx.query.namespace, ctx.query.service, ctx.query.version)]
    }

    static async serviceNameForList(ctx) {
        ctx.body = [...ZookeeperOperation.getServices(ctx.query.namespace, ctx.query.service)];
    }

    static async namespaces(ctx) {
        ctx.body = [...ZookeeperOperation.namespace];
    }

    static async disable(ctx) {
        await ZookeeperOperation.disable(ctx.query.namespace, ctx.query.service, ctx.query.version, ctx.query.address);
        ctx.body = {};
    }
};