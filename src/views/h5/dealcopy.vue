<template>
    <div class="container">
        <p class="top">{{title}}</p>
        <div class="container" v-html="html">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title:'',
                html:'',
                group_id:this.$route.params.group_id,
                type:this.$route.params.type
            };
        },
        methods: {
            refreshRem(desW) {
                var winW = document.documentElement.clientWidth;
                document.documentElement.style.fontSize = winW / desW * 1 + 'px'
            },
            getHtml(){
                this.$api.getAgreementCopy({group_id:this.group_id,type:this.type}).then(res=>{
                    if(res.code == 1){
                        this.title = res.data.title
                        this.html = res.data.content

                    }else{
                        this.html = '暂无数据';
                    }
                })
            }
        },
        //创建前设置
        mounted() {
            this.refreshRem(350);
            window.addEventListener('resize', this.refreshRem(350));
            window.addEventListener('touchstart', function () { });
            document.querySelector("body").setAttribute("style", "min-width:350px");
            document.querySelector("#app22").setAttribute("style", "min-width:350px");
            this.getHtml();
        },
        //销毁前清除
        beforeDestroy() {
            document.querySelector("body").removeAttribute("style");
            document.querySelector("#app22").removeAttribute("style");
        },
    };
</script>

<style lang="scss" scoped>
    .top{
        text-align: center;
        width:100%;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .container{
        padding-top: 16px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 8px;
    }
    .content{
        white-space: pre-wrap;       /* css-3 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
        word-break:break-all;
        overflow:hidden;
        font-size: 15px;
        line-height: 24px;
        color:#333;

    }
    p{
        margin-top: 0px;
        font-size: 14px;
        margin-bottom: 0px;
    }
</style>