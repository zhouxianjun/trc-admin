<template>
    <div>
        <div class="title">
            <h3>路由规则</h3>
            <em></em>
        </div>
        <Row style="padding-left: 20px">
            <Col :sm="1">
                <label class="control-label">名称:</label>
            </Col>
            <Col :xs="{ span: 3, offset: 0 }" :lg="{ span: 4, offset: 0 }">
            <Input v-model="search.name" placeholder="根据路由名称查询"></Input>
            </Col>
            <Col :xs="{ span: 1, offset: 2 }" :lg="{ span: 1, offset: 3 }">
            <label class="control-label">服务:</label>
            </Col>
            <Col :xs="{ span: 3, offset: 0 }" :lg="{ span: 4, offset: 0 }">
            <Input v-model="search.service" placeholder="根据服务名称查询"></Input>
            </Col>
        </Row>
    </div>
</template>
<script>
    import view from '../script/view/router';
    import '../css/common.css';
    export default view;
</script>