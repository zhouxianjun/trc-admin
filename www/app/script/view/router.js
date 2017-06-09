/**
 * Created by alone on 17-5-22.
 */
'use strict';
import SimpleTable from "../../components/simple-table.vue";
import iTagsInput from "../../components/iview-tags-input.vue";
import Table from '../../components/i-table.vue';
import routerDetail from '../../components/router-detail.vue';
import Common from "../common";
import merge from 'merge';
export default {
    data() {
        return {
            search: {
                name: '',
                service: '',
                version: '',
                address: ''
            },
            tableWidth: 0,
            addRouterModel: false,
            removeRouterModal: false,
            removeRouterName: '',
            removeRouterItem: null,
            loadingBtn: false,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(routerDetail, {
                            props: {
                                detail: params.row
                            }
                        })
                    }
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '命名空间',
                    key: 'namespace'
                }, {
                    title: '服务名',
                    key: 'service'
                }, {
                    title: '版本号',
                    key: 'version'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.removeRouterItem = params.row;
                                        this.removeRouterName = params.row.name;
                                        this.removeRouterModal = true;
                                    }
                                }
                            },  '删除')
                        ]);
                    }
                }],
                data: []
            },
            router: {
                name: '',
                service: '',
                method: [],
                consumeHost: [],
                providerAddress: []
            },
            providers: [],
            methods: [],
            routerValidate: {
                name: [{required: true, trigger: 'blur' }],
                service: [{required: true, trigger: 'blur' }],
                method: [{required: true, type: 'array', trigger: 'blur' }],
                consumeHost: [{required: true, validator: Common.valid.ip, trigger: 'blur' }],
                providerAddress: [{required: true, validator: Common.valid.ip, trigger: 'blur' }]
            }
        }
    },
    async mounted() {
        let result = await this.fetch('/service/provider/list');
        if (result) {
            let key = new Set();
            this.providers = result.list.filter(item => {
                let value = `${item.namespace}.${item.version}.${item.service}`;
                let has = key.has(value);
                has || key.add(value);
                return has;
            });
        }

        await this.doQuery();
    },
    components: {
        SimpleTable,
        iTagsInput,
        Table,
        routerDetail
    },
    methods: {
        async removeRouter() {
            if (!this.removeRouterItem) return;
            let params = {
                namespace: this.removeRouterItem.namespace,
                version: this.removeRouterItem.version
            };
            delete this.removeRouterItem.namespace;
            delete this.removeRouterItem.version;
            delete this.removeRouterItem._index;
            this.loadingBtn = true;
            await this.fetch('/router/remove', {method: 'post', data: this.removeRouterItem, params: params});
            this.removeRouterItem = null;
            this.removeRouterModal = false;
            setTimeout(() => {this.doQuery();this.loadingBtn = false;}, 500);
        },
        saveRouter() {
            this.$refs['router'].validate(async (valid) => {
                if (valid) {
                    let body = merge.clone(this.router);
                    let split = body.service.split('/');
                    body.service = split[2];
                    await this.fetch('/router/add', {method: 'post', data: body, params: {
                        namespace: split[0],
                        version: split[1]
                    }});
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        async doQuery() {
            let routers = await this.fetch('/router/list', {params: this.search});
            routers && (this.table.data = routers.list || []);
            this.loadingBtn = false;
        },
        changeService(val) {
            let methods = new Set();
            for (let item of this.providers) {
                if (`${item.namespace}/${item.version}/${item.service}` === val) {
                    for (let m of item.methods.split(',')) {
                        methods.add(m);
                    }
                }
            }
            this.methods = [...methods];
        },
        changeConsumeHost(index, value) {
            this.changeTags(this.router.consumeHost, index, value);
        },
        changeProviderAddress(index, value) {
            this.changeTags(this.router.providerAddress, index, value);
        },
        changeTags(prop, index, value) {
            if (value) {
                prop.splice(index, 0, value);
            } else {
                prop.splice(index, 1);
            }
        }
    }
}