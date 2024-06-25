<template>
    <div class="nav-date">
        {{ currentTime }}
    </div>
</template>
<script>
import { getCurrentTime } from '@/utils'
export default {
    data() {
        return {
            currentTime: '',
        }
    },
    mounted() {
        this.getCurrentDate()
    },
    methods: {
        // 实时获取当前日期时间
        getCurrentDate() {
            const _this = this;
            function updateDate() {
                _this.currentTime = getCurrentTime()
            }
            updateDate()
            this.timer = setInterval(() => {
                updateDate()
            }, 1000)
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>
<style lang="scss" scoped>
.nav-date {
    min-width: 130px;
}
</style>
