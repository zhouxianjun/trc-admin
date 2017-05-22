/**
 * Created by alone on 17-5-12.
 */
'use strict';
import Common from '../../script/common';
import SelfMenu from '../../components/menu.vue';
import $ from 'jquery';
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
                name: '服务治理',
                sub: [{
                    id: 2,
                    icon: 'ios-navigate',
                    name: '菜单->1',
                    path: '/a',
                    pid: 1
                }, {
                    id: 3,
                    icon: 'ios-navigate',
                    name: '路由规则',
                    path: '/router',
                    pid: 1
                }, {
                    id: 4,
                    icon: 'ios-navigate',
                    name: '菜单->4',
                    path: '/c',
                    pid: 1
                }]
            }],
            tabs: [],
            service: {
                header: [{title: '命名空间', key: 'namespace'}, {title: '服务名', key: 'name'}],
                data: []
            },
            provider: {
                header: [{
                    title: '命名空间', key: 'namespace'
                }, {
                    title: '服务名', key: 'name'
                }, {
                    title: '版本号', key: 'version'
                }, {
                    title: '机器IP', key: 'host'
                }, {
                    title: '机器端口', key: 'port'
                }, {
                    title: '权重', key: 'weight'
                }, {
                    title: '启动时间', key: 'start'
                }],
                data: []
            },
            consumer: {
                header: [{
                    title: '命名空间', key: 'namespace'
                }, {
                    title: '服务名', key: 'name'
                }, {
                    title: '版本号', key: 'version'
                }, {
                    title: '机器IP', key: 'host'
                }, {
                    title: '访问', key: 'status'
                }, {
                    title: '路由', key: 'router'
                }, {
                    title: '启动时间', key: 'start'
                }],
                data: []
            },
            address: {
                header: [{title: 'IP', key: 'value'}, {title: '所属', key: 'own'}],
                data: []
            }
        }
    },
    async mounted() {
        window.onresize = () => {
            return (() => {
                this.screenHeight = autoHeight();
                this.tableWidth = this.calcTableWidth();
                this.pie.resize();
            })()
        };
        // 初始化数据
        let result = await this.fetch('/index/total');
        this.updateTableData(result);
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
        },
        updateTableData(result) {
            result.service.forEach(item => {this.service.data.push(item)});
            result.provider.forEach(item => {this.provider.data.push(item)});
            result.consumer.forEach(item => {this.consumer.data.push(item)});
            result.address.forEach(item => {this.address.data.push(item)});
        }
    }
}

function autoHeight() {
    return Common.getWindowHeight() - 65 - 65;
}