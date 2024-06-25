<template>
    <section>
        <div class="section-title">
            <router-link to="/auth/index">APP管理</router-link>
            > 邀请好友页面
        </div>
        <div v-loading="listLoading">
            <div class="section-list invite-app">
                <div class="section-item-header clearfix">
                    <span>APP发起邀请页面</span>
                </div>
                <div class="header-main clearfix">
                    <div class="left">
                        <div class="left-top"><img  src="./image/invite-app.png"></div>
                        <div class="left-bottom app-invite">
                            <div class="app-invite-title">活动规则</div>
                            <div class="app-invite-line"></div>
                            <div class="app-invite-note">{{invite_app_content}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top ">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面为APP发起邀请好友的页面，活动规则配置将显示在APP上，系统自动填入默认模板，修改后及时更新。</p>
                        </div>
                        <div class="right-center">
                            <div class="right-bottom-item">
                                <div class="info-item-left">活动规则</div>
                                <div class="info-item-right">
                                    <el-input
                                            class="textarea scrollBar"
                                            type="textarea"
                                            id="textarea"
                                            v-model="invite_app_content"
                                    />
                                </div>
                            </div>
                            <div class="right-bottom-item">
                                <div class="btn_succ sub-btn" @click="saveInviteApp">提交</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-list invite-h5">
                <div class="section-item-header clearfix">
                    <span>APP接受邀请H5页面</span>
                </div>
                <div class="header-main clearfix">
                    <div class="left">
                        <div class="left-top"><img  src="./image/invite-h5.png"></div>
                        <div class="left-bottom h5-invite">
                            <div class="app-invite-title">活动规则</div>
                            <div class="app-invite-line"></div>
                            <div class="app-invite-note">{{invite_h5_content}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top ">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面为APP用户隐私协议页面，配置后将显示在APP上，系统自动填入默认模板，修改后及时更新。</p>
                        </div>
                        <div class="right-center">
                            <div class="right-bottom-item">
                                <div class="info-item-left">活动规则</div>
                                <div class="info-item-right">
                                    <el-input
                                            class="textarea scrollBar"
                                            type="textarea"
                                            id="textarea"
                                            v-model="invite_h5_content"
                                    />
                                </div>
                            </div>
                            <div class="right-bottom-item">
                                <div class="btn_succ sub-btn" @click="saveInviteH5">提交</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-list download-app">
                <div class="section-item-header clearfix">
                    <span>APP 新用户通过链接下载APP</span>
                </div>
                <div class="header-main clearfix">
                    <div class="right">
                        <div class="right-top">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面提供下载APP能力，可用于扫码下载，用户通过活动接受邀请后下载。此页面需要将配图更换并将下载的链接填写。</p>
                        </div>
                        <div class="right-bottom">
                            <div class="right-bottom-item">
                                <router-link to="/auth/index/download"><div class="btn_succ sub-btn" >编辑</div></router-link>
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
                invite_app_content:'',
                invite_h5_content:''
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
                    .getPcConfig({})
                    .then(res => {
                        this.listLoading = false;
                        if (res.code == 1) {
                           that.invite_app_content = res.data.invite_app_note
                           that.invite_h5_content = res.data.invite_h5_note
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
            saveInviteApp(){
                this.$api.saveInviteConfig({type:1,invite_note:this.invite_app_content}).then(res=>{
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
            },
            //保存修改的配置消息
            saveInviteH5(){
                this.$api.saveInviteConfig({type:2,invite_note:this.invite_h5_content}).then(res=>{
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
                background: #E0E0E0;
                .left-top{
                    width: 375px;
                }
                .left-bottom {
                    width: 375px;
                    background: #FFFFFF;
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
                        width: 48px;
                        height: 20px;
                        font-size: 12px;
                        color: #333333;
                        line-height: 20px;
                    }
                    .info-item-right{
                        margin-left: 66px;
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
                        margin-left: 67px;
                        cursor: pointer;
                    }
     
                }

            }
        }
    }
    .invite-h5{
        height:803px;
        margin-top: 24px;
        .header-main .left .h5-invite{
            margin: 10px 0 20px 0;
            background: #FFFFFF;
            padding: 16px 0 60px 0;
            .app-invite-title{
                width: 72px;
                height: 28px;
                font-size: 18px;
                font-weight: bold;
                color: #333333;
                line-height: 28px;
                margin-left: 24px;
            }
            .app-invite-line{
                width: 343px;
                height: 1px;
                background: #EAEAEA;
                margin-top: 17px;
                margin-left: 16px;
                margin-right: 16px;
                margin-bottom: 14px;
            }
            .app-invite-note{
                white-space: pre-wrap;       /* css-3 */
                white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                white-space: -pre-wrap;      /* Opera 4-6 */
                white-space: -o-pre-wrap;    /* Opera 7 */
                word-wrap: break-word;       /* Internet Explorer 5.5+ */
                word-break:break-all;
                padding-left: 16px;
                padding-right: 16px;
                font-size: 13px;
                font-weight: 400;
                color: #999999;
                line-height: 20px;
            }
        }
    }
    .invite-app{
        height:803px;
        .header-main .left .app-invite{
            margin: 10px 0 20px 0;
            background: #FFFFFF;
            padding: 16px 0 60px 0;
            .app-invite-title{
                width: 72px;
                height: 28px;
                font-size: 18px;
                font-weight: bold;
                color: #333333;
                line-height: 28px;
                margin-left: 24px;
            }
            .app-invite-line{
                width: 343px;
                height: 1px;
                background: #EAEAEA;
                margin-top: 17px;
                margin-left: 16px;
                margin-right: 16px;
                margin-bottom: 14px;
            }
            .app-invite-note{
                white-space: pre-wrap;       /* css-3 */
                white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                white-space: -pre-wrap;      /* Opera 4-6 */
                white-space: -o-pre-wrap;    /* Opera 7 */
                word-wrap: break-word;       /* Internet Explorer 5.5+ */
                word-break:break-all;
                padding-left: 16px;
                padding-right: 16px;
                font-size: 13px;
                font-weight: 400;
                color: #999999;
                line-height: 20px;

            }
        }
    }
    .download-app{
        margin-top: 24px;
        .header-main {
            .right{
                margin-left: 0;
                .right-bottom-item .sub-btn{
                    margin-left: 0;
                }
            }
        }
    }
</style>
