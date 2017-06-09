/**
 * Created by alone on 17-5-11.
 */
import Index from '../view/index.vue';
import Home from '../view/home.vue';
import Router from '../view/router.vue';
import Provider from '../view/provider.vue';
export default [{
    path: '/',
    component: Index,
    children: [{
        path: 'home',
        component: Home
    }, {
        path: 'router',
        component: Router
    }, {
        path: 'provider',
        component: Provider
    }]
}]