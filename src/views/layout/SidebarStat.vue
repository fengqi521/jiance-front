<template>
    <aside class="scrollBar">
        <div v-for="(item, index) in nav_list" :key="index">
            <div
                v-show="showNewMenus(item.name)"
                class="aside-list"
                :class="{
                    'aside-act': $route.path.indexOf(item.path) != -1,
                    'aside-hover-act': current_index == index,
                }"
            >
                <div :class="`aside-top aside-top-${item.index}`" @click="handleOpenChild(index)">
                    <i class="top-icon"></i>
                    <span class="top-text">{{ item.name }}</span>
                    <span
                        class="top-arrow"
                        :class="{
                            'top-arrow-open': current_index == index,
                        }"
                    ></span>
                </div>
                <sf-collapse-transition>
                    <div v-if="current_index == index">
                        <div class="aside-main">
                            <div v-for="(citem, cindex) in item.children" :key="cindex">
                                <router-link
                                    v-show="showNewMenus(citem.name)"
                                    :to="citem.path"
                                    :target="citem.target ? '_blank' : '_self'"
                                    class="aside-item"
                                    :style="{
                                        color: getActive(citem) != -1 ? '#fff' : '',
                                    }"
                                >
                                    {{ citem.name }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </sf-collapse-transition>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'SidebarStat',
    components: {},
    data() {
        return {
            current_index: -1,
            nav_list: [
                {
                    name: '数据分析',
                    index: 1,
                    path: 'stat/data',
                    children: [
                        {
                            name: '运营数据分析',
                            path: '/stat/data/operation',
                        },
                        {
                            name: '运维数据分析',
                            path: '/stat/data/charging',
                        },
                    ],
                },
                {
                    name: '设备管理',
                    path: 'stat/device',
                    index: 2,
                    children: [
                        {
                            name: '充电站管理',
                            path: '/stat/device/station',
                        },
                        {
                            name: '充电桩管理',
                            path: '/stat/device/pile',
                        },
                        {
                            name: '充电记录管理',
                            path: '/stat/device/charge',
                        },
                        {
                            name: '设备故障记录',
                            path: '/stat/device/log',
                        },
                    ],
                },
                {
                    name: '交易中心',
                    path: 'stat/trad',
                    index: 3,
                    children: [
                        {
                            name: '账单管理',
                            path: '/stat/trad/bill',
                        },
                        {
                            name: '售后管理',
                            path: '/stat/trad/service',
                        },
                    ],
                },
            ],
            menus: JSON.parse(this.$store.getters.menus),
        }
    },
    watch: {
        '$route.path': {
            handler(newItem, oldItem) {
                // console.log(newItem, oldItem);
            },
            deep: true,
        },
    },
    created() {
        this.nav_list.map((item, index) => {
            if (this.$route.path.indexOf(item.path) != -1) {
                this.current_index = index
            }
        })
    },
    mounted() {
        this.getParams()
    },
    methods: {
        //获取参数
        getParams() {
            const { title, operator_id } = this.$utils.getQueryObject(window.location.href)
            if (title && operator_id) {
                this.nav_list.forEach(item => {
                    const { children } = item
                    children.map(child => {
                        child.activePath = child.path
                        child.path = child.path + `?title=${title}&operator_id=${operator_id}`
                    })
                })
            }
        },

        //选中态
        getActive(item) {
            if (!item) return
            const { activePath } = item
            return this.$route.path.indexOf(activePath)
        },
        showNewMenus(_menu) {
            let permissions = this.menus ? this.menus : []
            if (permissions.indexOf(_menu) != -1) {
                return true
            }
            return ''
        },
        handleOpenChild(ind) {
            this.current_index = this.current_index == ind ? -1 : ind
        },
    },
}
</script>
