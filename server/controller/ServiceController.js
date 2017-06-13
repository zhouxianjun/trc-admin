/**
 * Created by alone on 17-5-15.
 */
'use strict';
const ZookeeperOperation = require('../ZookeeperOperation');
const Utils = require('../Utils');
const Result = require('../dto/Result');
const minimatch = require('minimatch');
module.exports = class ServiceController {
    static get routers() {
        return [{
            method: 'get',
            path: '/service/provider/list',
            value: ServiceController.providers
        }, {
            method: 'get',
            path: '/service/consumer/list',
            value: ServiceController.consumers
        }, {
            method: 'post',
            path: '/service/provider/disable',
            value: ServiceController.disableProvider
        }, {
            method: 'post',
            path: '/service/provider/enable',
            value: ServiceController.enableProvider
        }, {
            method: 'post',
            path: '/service/consumer/disable',
            value: ServiceController.disableConsumer
        }, {
            method: 'post',
            path: '/service/consumer/enable',
            value: ServiceController.enableConsumer
        }, {
            method: 'post',
            path: '/service/consumer/shield',
            value: ServiceController.shield
        }, {
            method: 'post',
            path: '/service/consumer/recovery',
            value: ServiceController.recovery
        }, {
            method: 'post',
            path: '/service/provider/override',
            value: ServiceController.override
        }];
    }

    static async providers(ctx) {
        ctx.body = new Result(true, {
            key: 'list',
            value: ZookeeperOperation.provider.filter(r => {
                return minimatch(r.service, ctx.query.service || '*') &&
                    minimatch(r.version, ctx.query.version || '*') &&
                    minimatch(r.namespace, ctx.query.namespace || '*')
            })
        }).json;
    }

    static async consumers(ctx) {
        ctx.body = new Result(true, {
            key: 'list',
            value: ZookeeperOperation.consumer.filter(r => {
                return minimatch(r.service, ctx.query.service || '*') &&
                    minimatch(r.version, ctx.query.version || '*') &&
                    minimatch(r.namespace, ctx.query.namespace || '*')
            })
        }).json;
    }

    static async disableProvider(ctx) {
        await ZookeeperOperation.create(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {disabled: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }
    static async enableProvider(ctx) {
        await ZookeeperOperation.remove(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {disabled: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }

    static async disableConsumer(ctx) {
        await ZookeeperOperation.create(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {consumer_disabled: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }
    static async enableConsumer(ctx) {
        await ZookeeperOperation.remove(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {consumer_disabled: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }

    static async shield(ctx) {
        await ZookeeperOperation.create(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {shielded: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }
    static async recovery(ctx) {
        await ZookeeperOperation.remove(ctx.query.namespace, ctx.query.service, ctx.query.version, 'configurators', {shielded: ctx.request.body.address});
        ctx.body = new Result(true).json;
    }

    static async override(ctx) {
        await ZookeeperOperation.override(ctx.query.namespace, ctx.query.service, ctx.query.version, ctx.query.address, ctx.request.body);
        ctx.body = new Result(true).json;
    }
};