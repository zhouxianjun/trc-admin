/**
 * Created by alone on 17-5-15.
 */
'use strict';
const ZookeeperOperation = require('../ZookeeperOperation');
const Utils = require('../Utils');
const Result = require('../dto/Result');
module.exports = class IndexController {
    static get routers() {
        return [{
            method: 'get',
            path: '/index/total',
            value: IndexController.total
        }];
    }
    static async total(ctx) {
        let totalResult = ZookeeperOperation.total;
        ctx.body = new Result(true, {
            key: 'service',
            value: [...totalResult.service]
        }, {
            key: 'provider',
            value: [...totalResult.provider]
        }, {
            key: 'consumer',
            value: [...totalResult.consumer]
        }, {
            key: 'address',
            value: [...totalResult.address]
        }).json;
    }
};