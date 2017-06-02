/**
 * Created by alone on 17-5-12.
 */
'use strict';
import Common from '../../script/common';
import SelfMenu from '../../components/menu.vue';
import SimpleTable from '../../components/simple-table.vue';
/*';
import merge from 'merge';
import 'admin-lte/plugins/datatables/dataTables.bootstrap.css';
import 'admin-lte/plugins/datatables/extensions/TableTools/css/dataTables.tableTools.min.css';
import 'admin-lte/plugins/datatables/dataTables.bootstrap.min';
import 'admin-lte/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min';*/
const user2x160 = require('admin-lte/dist/img/user2-160x160.jpg');
export default {
    data () {
        return {
            active: 0,
            img: {
                user2x160: user2x160
            },
            tables: {
                service: {
                    columns: [{
                        header: '命名空间',
                        name: 'namespace'
                    }, {
                        header: '服务名',
                        name: 'name'
                    }],
                    data: []
                },
                provider: {
                    columns: [{
                        header: '命名空间',
                        name: 'namespace'
                    }, {
                        header: '服务名',
                        name: 'name'
                    }, {
                        header: '版本号',
                        name: 'version'
                    }, {
                        header: '机器IP',
                        name: 'host'
                    }, {
                        header: '机器端口',
                        name: 'port'
                    }, {
                        header: '权重',
                        name: 'weight'
                    }, {
                        header: '启动时间',
                        name: 'start'
                    }],
                    data: []
                },
                consumer: {
                    columns: [{
                        header: '命名空间',
                        name: 'namespace'
                    }, {
                        header: '服务名',
                        name: 'name'
                    }, {
                        header: '版本号',
                        name: 'version'
                    }, {
                        header: '机器IP',
                        name: 'host'
                    }, {
                        header: '访问',
                        name: 'status'
                    }, {
                        header: '路由',
                        name: 'router'
                    }, {
                        header: '启动时间',
                        name: 'start'
                    }],
                    data: []
                },
                address: {
                    columns: [{
                        header: '地址',
                        name: 'value'
                    }, {
                        header: '所属',
                        name: 'own'
                    }],
                    data: []
                }
            },
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
                    pid: 1,
                    sub: [{
                        id: 5,
                        name: 'test',
                        path: '/a'
                    }]
                }]
            }, {
                id: 6,
                name: 'test2',
                sub: [{
                    id: 7,
                    name: 'test22'
                }]
            }],
            tabs: []
        }
    },
    async mounted() {
        // 初始化数据
        let result = await this.fetch('/index/total');
        this.updateTableData(result);
    },
    components: {
        SelfMenu,
        SimpleTable
    },
    watch:{

    },
    computed: {

    },
    methods: {
        selectedTab(selected) {
            this.selectedMenu(selected);
            this.active = selected;
        },
        closeTab(name) {
            let index = this.tabs.findIndex(tab => {
                if (tab.id === parseInt(name)) {
                    return true;
                }
            });
            if (index > -1) {
                this.tabs.splice(index);
                this.selectedTab(this.tabs[this.tabs.length - 1].id);
            }
        },
        selectedMenu(selected) {
            if (selected === 0) return;
            let menu = this.findMenu(this.menus, selected);
            let matched = menu.path ? this.$router.getMatchedComponents(menu.path): [];
            if (!matched.length) {
                alert('未实现');
                return;
            }
            if (!this.tabs.includes(menu)) {
                this.tabs.push(menu);
            }
            setTimeout(() => {
                $(`a[href="#tab-${menu.id}"]`).tab('show');
                this.$router.push(menu.path);
            }, 20);
            this.active = selected;
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
        initDataTables() {
            /*Common.tableToolsButton();
            // 初始化服务表格
            $('#service-table').DataTable(merge(Common.dataTableSettings, {
                dom: 'T<"clear">lfrtip',
                paging: false,
                serverSide: false,
                ajax: function (data, callback, settings) {

                },
                columns: [{
                    data: 'date',
                    render: function(date) {
                        //return moment(date).format('YYYY-MM-DD');
                    }
                }, {
                    data: 'installed'
                }, {
                    data: 'mobile_active'
                }, {
                    data: 'app_active'
                }]
            }));
            // 初始化生产者表格
            $('#provider-table').DataTable();
            // 初始化消费者表格
            $('#consumer-table').DataTable();
            // 初始化机器表格
            $('#address-table').DataTable();*/
        },
        updateTableData(result) {
            this.tables.service.data = result.service;
            this.tables.provider.data = result.provider;
            this.tables.consumer.data = result.consumer;
            this.tables.address.data = result.address;
        }
    }
}