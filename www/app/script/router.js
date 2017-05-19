/**
 * Created by alone on 17-5-11.
 */
import Index from '../view/index.vue';
import TabA from '../view/a.vue';
export default [{
    path: '/',
    component: Index,
    children: [{
        path: 'a',
        component: TabA
    }]
}]