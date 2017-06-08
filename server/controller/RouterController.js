/**
 * Created by alone on 17-5-15.
 */
'use strict';
const ZookeeperOperation = require('../ZookeeperOperation');
const Utils = require('../Utils');
const Result = require('../dto/Result');
const minimatch = require('minimatch');
module.exports = class RouterController {
    static get routers() {
        return [{
            method: 'get',
            path: '/router/list',
            value: RouterController.list
        }, {
            method: 'post',
            path: '/router/add',
            value: RouterController.add
        }, {
            method: 'post',
            path: '/router/remove',
            value: RouterController.remove
        }];
    }
    static async add(ctx) {
        await ZookeeperOperation.addRouter(ctx.query.namespace, ctx.request.body.service, ctx.query.version, ctx.request.body);
        ctx.body = new Result(true).json;
    }

    static async remove(ctx) {
        await ZookeeperOperation.removeRouter(ctx.query.namespace, ctx.request.body.service, ctx.query.version, ctx.request.body);
        ctx.body = new Result(true).json;
    }

    static async list(ctx) {
        ctx.body = new Result(true, {
            key: 'list',
            value: ZookeeperOperation.router.filter(r => {
                return minimatch(r.name, ctx.query.name || '*') &&
                    minimatch(r.service, ctx.query.service || '*') &&
                    minimatch(r.version, ctx.query.version || '*') &&
                    minimatch(r.consumeHost, ctx.query.address || '*') &&
                    minimatch(r.providerAddress, ctx.query.address || '*')
            })
        }).json;
    }
};