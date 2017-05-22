<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 10px 5px 5px 10px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        overflow-y: auto;
    }
    .layout-content-main{
        padding: 0 10px 10px 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .overview {
        padding-bottom: 40px;
    }
    .overview h1 {
        font-size: 18px;
        color: #464c5b;
        line-height: 24px;
        padding-bottom: 15px;
        font-weight: 400;
    }
    .overview-box {
        overflow: hidden;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-align: baseline;
        -ms-flex-align: baseline;
        align-items: baseline;
    }
    .overview-num {
        float: left;
        font-size: 32px;
        color: #464c5b;
        line-height: 48px;
        padding-right: 12px;
    }
    .overview .ivu-tooltip-inner {
        white-space: normal;
    }
</style>
<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu :active-name="activeMenu" @on-select="selectedMenu" theme="dark" width="auto">
                    <div class="layout-logo-left"></div>
                    <self-menu :spanLeft="spanLeft" :iconSize="iconSize" :menu="menu" v-for="menu in menus" :key="menu.id"></self-menu>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="layout-content" v-bind:style="{height: `${screenHeight}px`}">
                    <Tabs type="card" v-model="activeTab" closable @on-click="selectedTab" @on-tab-remove="closeTab">
                        <Tab-pane name="0" label="首页" :closable="false" class="layout-content-main overview">
                            <h1>服务概览</h1>
                            <Row :gutter="16">
                                <Col span="6">
                                <div class="overview-box">
                                    <div class="overview-num" v-html="service.data.length"></div>
                                </div>
                                <Tooltip placement="bottom-start">
                                    服务名称
                                    <div slot="content">
                                        注册的所有服务
                                    </div>
                                </Tooltip>
                                </Col>
                                <Col span="6">
                                <div class="overview-box">
                                    <div class="overview-num" v-html="provider.data.length"></div>
                                </div>
                                <Tooltip content="所有注册的服务生产者">
                                    生产者
                                </Tooltip>
                                </Col>
                                <Col span="6">
                                <div class="overview-box">
                                    <div class="overview-num" v-html="consumer.data.length"></div>
                                </div>
                                <Tooltip content="所有注册的服务消费者">
                                    消费者
                                </Tooltip>
                                </Col>
                                <Col span="6">
                                <div class="overview-box">
                                    <div class="overview-num" v-html="address.data.length"></div>
                                </div>
                                <Tooltip content="所有注册的机器地址IP和端口">
                                    机器
                                </Tooltip>
                                </Col>
                            </Row>
                            <div class="view-hr" style="margin-top: 40px;font-size: 16px"><b>服务详情</b></div>
                            <Tabs name="service" class="no-border" style="height: 100%;">
                                <Tab-pane style="padding-right: 2px" name="service" label="服务">
                                    <Table :columns="service.header" :data="service.data"></Table>
                                </Tab-pane>
                                <Tab-pane style="padding-right: 2px" name="provider" label="生产者">
                                    <Table :columns="provider.header" :data="provider.data"></Table>
                                </Tab-pane>
                                <Tab-pane style="padding-right: 2px" name="consumer" label="消费者">
                                    <Table :columns="consumer.header" :data="consumer.data"></Table>
                                </Tab-pane>
                                <Tab-pane style="padding-right: 2px" name="address" label="机器">
                                    <Table :columns="address.header" :data="address.data"></Table>
                                </Tab-pane>
                            </Tabs>
                        </Tab-pane>
                        <Tab-pane v-for="tab in tabs" :name="`${tab.id}`" :key="tab.id" :label="tab.name" :icon="tab.icon" class="layout-content-main">
                            <router-view></router-view>
                        </Tab-pane>
                    </Tabs>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import view from '../script/view/index';
    import '../css/common.css';
    export default view;
</script>