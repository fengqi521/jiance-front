<template>
    <section>
        <div class="section-title">
            <router-link to="/auth/index">APP管理</router-link>
            > 组队活动页面
        </div>
        <div v-loading="listLoading">
            <div class="section-list">
                <div class="section-item-header clearfix">
                    <span>APP发起组队邀请</span>
                </div>
                <div class="header-main clearfix">
                    <div class="left" :style="background">
                        <div class="left-top">
                            <img src="./image/activity.png">
                        </div>
                        <div class="left-bottom">
                            <div class="left-bottom-img">
                                <img :src="real_src">
                            </div>
                            <div class="left-bottom-btn">打开APP</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <p class="right-top-title">注意：</p>
                            <p class="right-top-content">此页面提供下载APP能力，可用于扫码下载，用户通过活动接受邀请后下载。此页面需要将配图更换并将下载的链接填写。</p>
                        </div>
                        <div class="right-center">
                            <!-- 上传图片 -->
                            <div class="info-item">
                                <div class="info-item-left">上传图片</div>
                                <div class="info-item-right">
                                    <el-upload
                                            class="cover-uploader"
                                            :action="`${ENV}/platform/upload-app-img`"
                                            :show-file-list="false"
                                            :beforeUpload="beforeAvatarUpload"
                                            :on-success="uploadCoverImageSuccess"
                                    >
                                        <div
                                                v-if="real_src"
                                                class="uploader-main"
                                        >
                                            <img
                                                    :src="real_src"
                                                    class="coverImg"
                                            >
                                            <div
                                                    class="edit-uploader"
                                            >更换图片…
                                            </div>
                                        </div>
                                        <div
                                                v-else
                                                class="uploader-main__1"
                                        >
                                            <div class="uploader-icon"></div>
                                        </div>
                                    </el-upload>

                                </div>
                                <div class="uploader-detail">* 建议尺寸750*964px</div>
                                <div class="uploader-tips">（只能上传jpg/png格式文件，文件不能超过1M）</div>
                            </div>
                        </div>
                        <div class="right-bottom">
                            <div class="right-bottom-item">
                                <div class="info-item-left">选择颜色</div>
                                <div class="info-item-right">
                                    <div class="item-right-title">点击选择背景颜色，作为H5页面的背景</div>
                                    <el-color-picker v-model="background.background" size="medium"></el-color-picker>
                                </div>
                            </div>
                            <div class="right-bottom-item">
                                <div class="btn_succ sub-btn" @click="saveChange">提交</div>
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
                id: this.$route.query.id || 0,
                month: this.$route.query.month || "",
                detail: {
                    out_trade_id: "--",
                    real_amount: "0"
                },
                pile: {},
                station: {},
                user: {},
                listLoading: false,
                img_src: '',
                real_src: '',
                ENV: process.env.NODE_ENV == "development" ? "/api" : "",
                android_url: '',
                ios_url: '',
                background:{
                    background:'#70B08F'
                }
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
                            that.img_src = res.data.activity_img
                            that.real_src = `${this.ENV}` + res.data.activity_img;
                            that.background.background = res.data.activity_backgroud_color
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
            saveChange() {
                this.$api.saveActivityConfig({
                    activity_img: this.img_src,
                    background_color: this.background.background
                }).then(res => {
                    if (res.code == 1) {
                        this.$sfNotify({
                            message: "成功",
                        });
                        this.getDetail()
                    } else {
                        this.$sfNotify({
                            duration: 0,
                            type: "error",
                            message: "配置失败"
                        });
                    }
                })
            },
            beforeAvatarUpload(file) {
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'jpg'
                const extension2 = testmsg === 'png'
                const isLt2M = file.size / 1024 / 1024 < 1
                if(!extension && !extension2) {
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: '上传文件只能是 jpg、png格式!',
                    });
                }
                if(!isLt2M) {
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: '上传文件大小不能超过 1MB!',
                    });
                }
                return extension || extension2 && isLt2M
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
            }

            .left {
                width: 375px;
                height: 691px;
                border: 1px solid #E0E0E0;

                .left-top {
                    height: 88px;
                }

                .left-bottom {
                    height: 603px;

                    .left-bottom-img {
                        height: 482px;
                    }

                    .left-bottom-btn {
                        width: 327px;
                        height: 46px;
                        background: #FFFFFF;
                        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
                        border-radius: 100px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 500;
                        color: #333333;
                        line-height: 46px;
                        margin-left: 24px;
                        margin-top: 14px;
                    }
                }
            }

            .right {
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

                .info-item {
                    padding-bottom: 24px;

                    .info-item-left {
                        position: relative;
                        float: left;
                        max-width: 86px;
                        font-size: 12px;
                        color: #333;
                        line-height: 36px;

                        i {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 36px;
                            line-height: 36px;
                            display: block;
                            padding-right: 4px;
                            color: #FF6632;
                        }
                    }

                    .uploader-detail,
                    .uploader-tips {
                        margin-left: 60px;
                        width: 280px;
                    }

                    .uploader-detail {
                        margin-top: 4px;
                    }

                    .info-item-right {
                        margin-left: 66px;

                        .cover-uploader {
                            width: 124px;
                            height: 160px;
                            /*border: 1px dashed #E0E0E0;*/
                            background-color: #F5F5F5
                        }
                        .edit-uploader {
                            position: absolute;
                            top: 82px;
                            left: 148px;
                            width: 82px;
                            height: 36px;
                            line-height: 34px;
                            text-align: center;
                            background: rgba(255, 255, 255, 1);
                            font-size: 12px;
                            border-radius: 3px;
                            color: #333;
                            border: 1px solid rgba(224, 224, 224, 1);

                            &:hover {
                                color: $a-hover;
                                border-color: $a-hover;
                            }
                        }
                    }
                }

                .right-bottom-item {
                    margin-bottom: 32px;
                    /deep/ .el-color-picker--medium .el-color-picker__trigger{
                        height:64px;
                        width:64px;
                    }
                    /deep/ .el-icon-arrow-down:before{
                        background: url("./image/open.png") no-repeat;
                        position: absolute;
                        top: -11px;
                        left: 20px;
                        width: 24px;
                        height: 24px;
                        background-size: contain;
                        border-radius: 50%;
                        transition: background 0.3s ease-in;
                        content: '';
                    }
                    .info-item-left {
                        position: relative;
                        float: left;
                        width: 72px;
                        height: 20px;
                        font-size: 12px;
                        color: #333333;
                        line-height: 20px;
                    }

                    .info-item-right {
                        margin-left: 72px;

                        .apk_url {
                            width: 400px;
                        }

                        .item-right-title {
                            width: 324px;
                            height: 20px;
                            font-size: 12px;
                            color: #666666;
                            line-height: 20px;
                            margin-bottom: 8px;
                        }
                    }

                    .sub-btn {
                        width: 144px;
                        height: 36px;
                        border-radius: 3px;
                        text-align: center;
                        line-height: 36px;
                        color: #FFFFFF;
                        margin-left: 72px;
                        cursor: pointer;
                    }
                  
                }

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
