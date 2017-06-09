/**
 * Created by alone on 17-5-22.
 */
'use strict';
import Table from "../../components/i-table.vue";
import providerDetail from "../../components/provider-detail.vue";
export default {
    data() {
        return {
            search: {
                namespace: '*',
                service: '*',
                version: '*',
                address: '*'
            },
            disableProviderModal: false,
            disableProviderItem: null,
            loadingBtn: false,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(providerDetail, {
                            props: {
                                detail: params.row
                            }
                        })
                    }
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
                    title: '机器地址',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', `${params.row.host}:${params.row.port}`);
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: params.row.status ? 'error' : 'success',
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        if (params.row.status) {
                                            this.disableProviderItem = params.row;
                                            this.disableProviderModal = true;
                                        } else {
                                            await this.enableProvider(params.row);
                                        }
                                    }
                                }
                            }, params.row.status ? '禁用' : '启用')
                        ]);
                    }
                }],
                data: []
            }
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    methods: {
        async disableProvider() {
            if (!this.disableProviderItem) return;
            let params = {
                namespace: this.disableProviderItem.namespace,
                version: this.disableProviderItem.version,
                service: this.disableProviderItem.service
            };
            this.loadingBtn = true;
            await this.fetch('/service/provider/disable', {method: 'post', data: {address: `${this.disableProviderItem.host}:${this.disableProviderItem.port}`}, params: params});
            this.disableProviderItem = null;
            this.disableProviderModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async enableProvider(item) {
            let params = {
                namespace: item.namespace,
                version: item.version,
                service: item.service
            };
            this.loadingBtn = true;
            await this.fetch('/service/provider/enable', {method: 'post', data: {address: `${item.host}:${item.port}`}, params: params});
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let routers = await this.fetch('/service/provider/list', {params: this.search});
            routers && (this.table.data = routers.list || []);
            this.loadingBtn = false;
        }
    }
}