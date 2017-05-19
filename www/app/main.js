/**
 * Created by alone on 17-5-11.
 */
"use strict";
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './view/app.vue';
import Routers from './script/router.js';       // 路由列表
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import axios from 'axios';

Vue.use(VueRouter);
Vue.use(iView);
/**
 * 拉取服务器信息
 * @param url
 * @param error
 * @param config
 * @returns {Promise.<*>}
 */
Vue.prototype.fetch = async (url, config, error = r => console.log(r)) => {
    iView.LoadingBar.start();
    let response = null, result = null;
    try {
        response = await axios(url, config);
        result = response ? response.data : null;
        if (!response || response.status !== 200 || !result || !result.success) {
            throw new Error(`fetch ${url} data ${JSON.stringify(config)} error`);
        }
        iView.LoadingBar.finish();
        return result.data;
    } catch (err) {
        iView.LoadingBar.error();
        console.error(err);
        if (typeof error === 'function') {
            Reflect.apply(error, response, result);
            return false;
        }
    }
};

const app = new Vue({
    el: '#app',
    router: new VueRouter({
        routes: Routers
    }),
    render: h => h(App)
});