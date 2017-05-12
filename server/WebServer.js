/**
 * Created by alone on 17-5-10.
 */
'use strict';
const Utils = require('./Utils');
const logger = require('tracer-logger');
const Result = require('./dto/Result');
const Router = require('koa-router');
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const router = new Router();
const AUTH_PREFIX = 'Basic ';
const user = `admin`;
const pwd = `admin`;

//body
app.use(bodyParser());
//logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.debug(`Web Method: ${ctx.method} Url: ${ctx.url} Time: ${ms}`);
});

// Authenticate
app.use(async (ctx, next) => {
    let authorization = ctx.header['authorization'];
    if (authorization && authorization.length > AUTH_PREFIX.length) {
        logger.debug(`authorization ${authorization}`);
        if (`${user}:${pwd}` === new Buffer(authorization.substring(AUTH_PREFIX.length), 'base64').toString()) {
            await next();
            return;
        }
    }
    ctx.status = 401;
    ctx.set('WWW-Authenticate', `${AUTH_PREFIX} realm="trc admin need auth"`);
});

app.use(async (ctx, next) => {
    await next();
    if (404 !== ctx.status) return;
    if (ctx.accepts('html', 'json') === 'html') {

    } else {
        ctx.body = new Result(Result.CODE.NOT_FOUND).json;
    }
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = new Result(false, err.msg || err.message || '操作失败').json;
        logger.error('router error', err, this);
    }
});

//static
app.use(Static('./www'));

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

process.on('uncaughtException', err => {logger.error('uncaughtException', err)});

Utils.loadController(router, './server/controller');
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;