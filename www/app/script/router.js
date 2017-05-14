/**
 * Created by alone on 17-5-11.
 */
import Index from '../view/index.vue';
import TabA from '../view/a.vue';
import TabB from '../view/b.vue';
export default [{
    path: '/',
    component: Index,
    children: [{
        path: 'a',
        component: TabA
    }, {
        path: 'b',
        component: TabB
    }]
}]