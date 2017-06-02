/**
 * Created by alone on 17-5-22.
 */
'use strict';
import SimpleTable from "../../components/simple-table.vue";
import Modal from "../../components/modal.vue";
import Input from "iview/src/components/input";
import Form from "iview/src/components/form";
import {Option, OptionGroup, Select} from "iview/src/components/select";
import tagsInput from 'vue-tagsinput';
import iTagsInput from '../../components/iview-tags-input.vue';
import "../../plugins/bootstrapvalidator/css/bootstrapValidator.min.css";
import "../../plugins/bootstrapvalidator/js/bootstrapValidator.min";
import "../../plugins/bootstrapvalidator/js/language/zh_CN";
const FormItem = Form.Item;
import Common from '../common';
export default {
    data() {
        return {
            search: {
                name: '',
                service: '',
                version: '',
                address: ''
            },
            table: {
                columns: [{
                    header: '名称',
                    name: 'name'
                }, {
                    header: '命名空间',
                    name: 'namespace'
                }, {
                    header: '服务名',
                    name: 'service'
                }, {
                    header: '版本号',
                    name: 'version'
                }, {
                    header: '匹配规则',
                    name: 'value'
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
        Modal,
        Select,
        Option,
        OptionGroup,
        Form,
        FormItem,
        Input,
        tagsInput,
        iTagsInput
    },
    methods: {
        saveRouter(close) {
            let validate = $('#addRouterForm').bootstrapValidator('validate');
            $('#addRouterForm').data('bootstrapValidator').isValid() && close();
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
            if (value) {
                this.router.consumeHost.splice(index, 0, value);
            } else {
                this.router.consumeHost.splice(index, 1);
            }
        }
    }
}