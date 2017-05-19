/**
 * Created by alone on 17-5-12.
 */
'use strict';
import Common from '../../script/common';
import SelfMenu from '../../components/menu.vue';
import $ from 'jquery';
// 引入基本模板
const echarts = require('echarts/lib/echarts');
// 引入饼图组件
require('echarts/lib/chart/pie');
// 引入提示框和图例组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
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
            tabs: [],
            service: {
                header: [{title: '服务名称', key: 'name'}],
                data: []
            },
            provider: {
                header: [{title: '生产者', key: 'name'}],
                data: []
            },
            consumer: {
                header: [{title: '消费者', key: 'name'}],
                data: []
            },
            address: {
                header: [{title: '机器', key: 'name'}],
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
            result.service.forEach(item => {this.service.data.push({name: item})});
            result.provider.forEach(item => {this.provider.data.push({name: item})});
            result.consumer.forEach(item => {this.consumer.data.push({name: item})});
            result.address.forEach(item => {this.address.data.push({name: item})});
        }
    }
}

function autoHeight() {
    return Common.getWindowHeight() - 65 - 65;
}