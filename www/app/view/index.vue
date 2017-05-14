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
                        <Tab-pane name="0" label="首页" :closable="false" class="layout-content-main">
                            这是首页
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
    export default view;
</script>