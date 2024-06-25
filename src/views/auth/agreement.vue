<template>
    <section>
        <div class="section-title">
            <router-link to="/auth/index">APP管理</router-link>
            > 用户使用协议页面
        </div>
        <div v-loading="listLoading">
            <div class="section-list">
                <div class="section-item-header clearfix">
                    <span>APP用户使用协议页面</span>
                </div>
                <div class="header-main clearfix">
                    <div class="left">
                        <div class="left-top"><img  src="./image/agreement_top.png"></div>
                        <div class="left-bottom">
                            <div class="left-bottom-title">{{title}}</div>
                            <div class="left-bottom-content">{{content}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top ">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面为APP用户使用协议页面，配置后将显示在APP上，系统自动填入默认模板，修改后及时更新。</p>
                        </div>
                        <div class="right-center">
                            <div class="right-bottom-item">
                                <div class="info-item-left">标题</div>
                                <div class="info-item-right">
                                    <div class="item-right-title">标题将用在登录注册页、正文页展示</div>
                                    <el-input
                                            class="apk_url"
                                            v-model="title"
                                            placeholder="请输入用户使用协议标题"
                                    />
                                </div>
                            </div>
                            <div class="right-bottom-item">
                                <div class="info-item-left">内容</div>
                                <div class="info-item-right">
                                    <el-input
                                            class="textarea scrollBar"
                                            type="textarea"
                                            id="textarea"
                                            v-model="content"
                                    />
                                </div>
                            </div>
                            <div class="right-bottom-item">
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
    export default {
        name: "",
        components: {},
        data() {
            return {
                listLoading: false,
                title:'',
                content:''
            };
        },
        created() {
            this.getDetail();
        },
        methods: {
            getDetail() {
                this.listLoading = true;
                var that = this;
                this.$api
                    .getPcAgreement({type:2})
                    .then(res => {
                        this.listLoading = false;
                        if (res.code == 1) {
                           that.title = res.data.title
                           that.content = res.data.content
                        }
                    });
            },
            //上传图片成功回调
            uploadCoverImageSuccess(res, file) {
                if (res.code == 1) {
                    this.img_src = res.url;
                    this.real_src = `${this.ENV}` + res.url;
                }
            },
            //保存修改的配置消息
            saveChange(){
                this.$api.saveAgreement({title:this.title,content:this.content,type:2}).then(res=>{
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
                position: absolute;
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
                    .left-bottom-title{
                        height: 18px;
                        font-size: 16px;
                        font-weight: Medium;
                        color: #333333;
                        line-height: 18px;
                        text-align: center;
                        margin-top: 24px;
                        margin-bottom: 18px;
                    }
                    .left-bottom-content{
                        white-space: pre-wrap;       /* css-3 */
                        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                        white-space: -pre-wrap;      /* Opera 4-6 */
                        white-space: -o-pre-wrap;    /* Opera 7 */
                        word-wrap: break-word;       /* Internet Explorer 5.5+ */
                        word-break:break-all;
                        padding-bottom: 16px;
                        font-size: 14px;
                        line-height: 24px;
                        color: #333333;
                        font-weight: Medium;
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
                flex: 1;
                margin-left: 431px;

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
                .textarea{
                    height: 411px;
                    max-width: 675px;
                }
                .right-bottom-item{
                    margin-bottom: 32px;
                    .info-item-left{
                        position: relative;
                        float: left;
                        width: 24px;
                        height: 20px;
                        font-size: 12px;
                        color: #333333;
                        line-height: 20px;
                    }
                    .info-item-right{
                        margin-left: 48px;
                        .apk_url{
                            width:400px;
                        }
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
                        margin-left: 48px;
                        cursor: pointer;
                    }
                }

            }
        }
    }
</style>
