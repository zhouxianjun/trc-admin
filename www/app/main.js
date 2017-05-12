/**
 * Created by alone on 17-5-11.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './view/app.vue';
import Routers from './script/router.js';       // 路由列表
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS

Vue.use(VueRouter);
Vue.use(iView);

const app = new Vue({
    el: '#app',
    router: new VueRouter({
        routes: Routers
    }),
    render: h => h(App)
});