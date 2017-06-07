/**
 * Created by alone on 17-5-22.
 */
'use strict';
import SimpleTable from "../../components/simple-table.vue";
import iTagsInput from "../../components/iview-tags-input.vue";
import iTable from '../../components/i-table.vue';
import Common from "../common";
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
            table: {
                columns: [{
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
                    title: '匹配规则',
                    key: 'value'
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
    },
    components: {
        SimpleTable,
        iTagsInput,
        iTable
    },
    methods: {
        saveRouter(close) {
            this.$refs['router'].validate((valid) => {
                if (valid) {
                    this.$Message.success({
                        content: '提交成功!',
                        duration: 0
                    });
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        changeService(val) {
            let methods = new Set();
            for (let item of this.providers) {
                if (`${item.namespace}.${item.version}.${item.service}` === val) {
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