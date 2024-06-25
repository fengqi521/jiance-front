<template>
    <section>
        <div class="section-title">
            <router-link to="/auth/index">APP管理</router-link>
            > 常见问题页面
        </div>
        <div v-loading="listLoading">
            <div class="section-list">
                <div class="section-item-header clearfix">
                    <span>APP常见问题页面</span>
                </div>
                <div class="header-main clearfix">
                    <div class="left">
                        <div class="left-top"><img  src="./image/question.png"></div>
                        <div class="left-bottom" v-html="html">
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top ">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面为APP常见问题页面，配置后将显示在APP上，系统自动填入默认模板，修改后及时更新。</p>
                        </div>
                        <div class="right-center">
                            <div class="right-bottom-item right-bottom-item-editor">
                                <div id="toolbar-container" class="toolbar"></div>
                                <div
                                        class="textarea scrollBar"
                                        :style="{'height':textHeight + 'px'}"
                                        id="textarea"
                                        v-model="html"
                                >
                                </div>
                            </div>
                            <div class="right-bottom-item right-bottom-btn">
                                <div class="btn_succ sub-btn" @click="saveChange">提交</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: "",
        components: {},
        data() {
            return {
                listLoading: false,
                title:'',
                content:'',
                textHeight:'500',
                html:''
            };
        },
        mounted() {
            let that = this;
            this.editor = new E('#toolbar-container',"#textarea");
            this.editor.config.menus = [
                'bold',
                'lineHeight',
                'foreColor',
                'justify',
                'undo',
                'redo',
            ]
            this.editor.config.zIndex = 1
            this.editor.config.onchange = function (newHtml) {
              that.html = newHtml;
            };
            this.editor.create();

            //控制文本框大小随着浏览器高度改变
            window.onresize =()  =>{
                return (()=>{
                    window.screenHeight = window.innerHeight
                    this.screenHeight = window.screenHeight;
                })()
            }
            //js原生方法给某个id下的子div添加class属性，此处是为了添加滚动条
            document.querySelector('#textarea>div'). classList.add("scrollBar");
        },
        created() {
            this.getDetail();
        },
        methods: {
            getDetail() {
                this.listLoading = true;
                var that = this;
                this.$api
                    .getPcQuestion({type:3})
                    .then(res => {
                        this.listLoading = false;
                        if (res.code == 1) {
                           that.html = res.data.desc
                            this.editor.txt.html(that.html);
                        }
                    });
            },
            //保存修改的配置消息
            saveChange(){
                var desc = this.editor.txt.html()
                this.$api.saveQuestion({desc:desc,type:3}).then(res=>{
                    if(res.code ==1 ){
                        this.$sfNotify({
                            message: "成功",
                        });
                        this.getDetail()
                    }else{
                        this.$sfNotify({
                            duration: 0,
                            type: "error",
                            message: "配置失败"
                        });
                    }
                })
            }
        }
    };
</script>
<style lang="scss" scoped>
    .section-list {
        padding: 0 24px 24px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(231, 232, 233, 1);


        .header-main {
            display: flex;
            margin-top: 24px;
            .left {
                float: left;
                width: 375px;
                height: 691px;
                border: 1px solid #E0E0E0;
                overflow-y: auto;
                overflow-x: hidden;
                .left-bottom {
                    width: 375px;
                    height: 603px;
                    background: #FFFFFF;
                    padding-left: 16px;
                    padding-right: 16px;
                    font-size: 14px;
                    /deep/ p:last-child{
                        padding-bottom: 16px;
                    }
                }
            }
            .left::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .left::-webkit-scrollbar-button:vertical {
                display: none;
            }

            .left::-webkit-scrollbar-track,
            .left::-webkit-scrollbar-corner {
                background-color: #D8D8D8;
            }

            .left::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: #999999;
            }

            .left::-webkit-scrollbar-thumb:vertical:hover {
                background-color: #999999;
            }

            .left::-webkit-scrollbar-thumb:vertical:active {
                background-color: #999999;
            }

            .right {
                float: left;
                flex: 1;
                margin-left: 56px;

                .right-top {
                    background: rgba(255, 183, 60, 0.15);
                    border-radius: 3px;
                    font-weight: bold;
                    color: #666666;
                    line-height: 20px;
                    font-size: 12px;
                    padding: 16px;
                    margin-bottom: 24px;

                    .right-top-title {
                        font-weight: bold;
                    }

                }
                .textarea {
                    caret-color: #38B487;
                    color: #333;
                    font-size: 12px;
                    line-height: 17px;
                    border-radius: 2px;
                    background: #fff;
                    border: 1px solid #E0E0E0 !important;
                    width: 80%;
                    height:467px !important;
                    float: left;
                    .w-e-text-container {
                        width: 467px;
                        height: 100%;
                    }

                    .w-e-toolbar {
                        width: 100%;
                    }
                }
                .right-bottom-item-editor{
                     height:507px;
                }
                .right-bottom-btn{
                    margin-top: 32px;
                }
                .right-bottom-item{
                    .info-item-left{
                        position: relative;
                        float: left;
                        width: 72px;
                        height: 20px;
                        font-size: 12px;
                        color: #333333;
                        line-height: 20px;
                    }
                    .info-item-right{
                        margin-left: 96px;
                        .item-right-title{
                            width: 324px;
                            height: 20px;
                            font-size: 12px;
                            color: #666666;
                            line-height: 20px;
                            margin-bottom: 8px;
                        }

                    }
                    .sub-btn{
                        width: 144px;
                        height: 36px;
                        border-radius: 3px;
                        text-align: center;
                        line-height: 36px;
                        color:#FFFFFF;
                        cursor: pointer;
                    }
                }

            }
        }
    }
</style>
