/**
 * Created by alone on 17-5-12.
 */
'use strict';
import Common from '../../script/common';
import SelfMenu from '../../components/menu.vue';
import Routers from '../router';
export default {
    data () {
        return {
            spanLeft: 5,
            spanRight: 19,
            screenHeight: autoHeight(),
            activeTab: 0,
            activeMenu: 0,
            menus: [{
                id: 1,
                icon: 'ios-navigate',
                name: '菜单一',
                sub: [{
                    id: 2,
                    icon: 'ios-navigate',
                    name: '菜单->1',
                    path: '/a',
                    pid: 1
                }, {
                    id: 3,
                    icon: 'ios-navigate',
                    name: '菜单->2',
                    path: '/b',
                    pid: 1
                }, {
                    id: 4,
                    icon: 'ios-navigate',
                    name: '菜单->4',
                    path: '/c',
                    pid: 1
                }]
            }],
            tabs: []
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.screenHeight = autoHeight()
            })()
        }
    },
    components: {
        SelfMenu
    },
    watch:{

    },
    computed: {
        iconSize () {
            return this.spanLeft === 5 ? 14 : 24;
        }
    },
    methods: {
        toggleClick () {
            if (this.spanLeft === 5) {
                this.spanLeft = 2;
                this.spanRight = 22;
            } else {
                this.spanLeft = 5;
                this.spanRight = 19;
            }
        },
        selectedTab(selected) {
            this.activeMenu = parseInt(selected);
            this.selectedMenu(this.activeMenu);
        },
        closeTab(name) {
            let index = this.tabs.findIndex(tab => {
                if (tab.id === parseInt(name)) {
                    return true;
                }
            });
            if (index > -1) {
                this.tabs.splice(index);
                this.selectedTab(this.activeTab);
            }
        },
        selectedMenu(selected) {
            if (selected === 0) return;
            let menu = this.findMenu(this.menus, selected);
            let matched = this.$router.getMatchedComponents(menu.path);
            if (!matched.length) {
                alert('未实现');
                return;
            }
            if (!this.tabs.includes(menu)) {
                this.tabs.push(menu);
            }
            this.$router.push(menu.path);
            this.activeTab = `${menu.id}`;
        },
        findMenu(menus, id) {
            for (let menu of menus) {
                if (menu.id === id) {return menu}
                if (menu.sub && menu.sub.length) {
                    let m = this.findMenu(menu.sub, id);
                    if (m) return m;
                }
            }
        }
    }
}

function autoHeight() {
    return Common.getWindowHeight() - 65 - 65;
}