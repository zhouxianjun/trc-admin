/**
 * Created by alone on 17-5-15.
 */
'use strict';
module.exports = class ServiceController {
    static get routers() {
        return [{
            method: 'post',
            path: '/service/list',
            value: ServiceController.list
        }];
    }
    static async list(ctx) {
        ctx.body = {};
    }
};