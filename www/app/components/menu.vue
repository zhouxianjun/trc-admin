<template>
    <Submenu :name="menu.id" v-if="menu.sub && menu.sub.length" v-show="!(spanLeft < 5 && menu.pid)">
        <template slot="title">
            <Icon :type="menu.icon" :size="iconSize"></Icon>
            <span v-show="spanLeft >= 5" v-text="menu.name"></span>
        </template>
        <self-menu :iconSize="iconSize" :spanLeft="spanLeft" :menu="menu" v-for="menu in menu.sub" :key="menu.id"></self-menu>
    </Submenu>
    <Menu-item :name="menu.id" v-else v-show="!(spanLeft < 5 && menu.pid)">
        <Icon :type="menu.icon" :size="iconSize"></Icon>
        <span v-show="spanLeft >= 5" v-text="menu.name"></span>
    </Menu-item>
</template>
<script>
    export default {
        name: 'self-menu',
        props: {
            menu: Object,
            iconSize: Number,
            spanLeft: Number
        }
    }
</script>