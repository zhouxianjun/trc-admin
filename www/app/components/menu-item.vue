<template>
    <li v-if="menu.sub && menu.sub.length" class="treeview">
        <a href="#">
            <i v-bind:class="`fa ${menu.icon}`"></i>
            <span v-html="menu.name"></span>
            <i class="fa fa-angle-left pull-right"></i>
        </a>
        <ul class="treeview-menu">
            <self-menu-item :menu="menu" v-for="menu in menu.sub" @on-selected="handClick" :key="menu.id"></self-menu-item>
        </ul>
    </li>
    <li v-else>
        <a href="#" :id="`menu-${menu.id}`" @click.stop.prevent="handClick(menu.id)"><i v-bind:class="`fa ${menu.icon}`"></i>
            <span v-html="menu.name"></span>
        </a>
    </li>
</template>
<script>
    export default {
        name: 'self-menu-item',
        props: {
            menu: Object
        },
        methods: {
            handClick(id) {
                this.$emit('on-selected', id);
            }
        }
    }
</script>