<template>
    <!-- :showModel.sync="showActivity" -->
    <sf-modelBox
            :showModel.sync="isChoosePilesProps"
            class="sf-model-box ad-station counpon-box pop-model-section"
            title="选择充电站"
            @change="closeStationModel"
    >
        <div
                class="station-check"
                v-show="roleTypeRules && roleTypeRules.length > 0"
        >
            <div class="section-item-header clearfix">
                <div class="checkbox-item checkbox-all">
                    <i
                            class="checkbox-icon"
                            :class="{ 'checkbox-act-icon': checkbox_all }"
                            @click="handleCheckedAll"
                    ></i
                    >全选
                </div>
            </div>
            <div class="section-main scrollBar clearfix">
                <div class="scrollBar-station">
                    <div
                            class="section-list clearfix"
                            v-for="(item, index) in roleTypeRules"
                            :key="index"
                    >
                        <div class="list-header">
              <span class="checkbox-item checkbox-header">
                <i
                        class="checkbox-icon"
                        :class="{ 'checkbox-act-icon': showFirstRule(item) }"
                        @click="addFirstRule(item)"
                ></i
                >{{ item.name }}
              </span>
                        </div>
                        <div class="list-outer" v-if="item.is_open">
                            <div
                                    class="list-content"
                                    v-show="item.child && item.child.length > 0"
                            >
                                <div class="content-right">
                  <span
                          class="checkbox-item"
                          v-for="(gItem, gIndex) in item.child"
                          :key="gIndex"
                  >
                    <i
                            class="checkbox-icon"
                            :class="{
                        'checkbox-act-icon':
                          modelInfo.rules.indexOf(gItem.station_id) != -1,
                      }"
                            @click="handleThirdChecked(gItem)"
                    ></i
                    >{{ gItem.name }}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </sf-modelBox>
</template>

<script>
    export default {
        name: 'sfPileStation',
        props: {
            isChoosePiles: {
                type: Boolean
            },
            stationData: {
                // type: null
            }
        },
        data () {
            return {
                //需要传过来的数据
                //全部充电桩数
                isChoosePilesProps: false,
                stationDataProps: [],//需要传值传过来的接口请求到的data数据

                isConnectPiles: true, //关联充电站为空,显示暂无数据

                rules: [],
                roleTypeRules: [],
                all_rules_ids: [],
                checkbox_all: false,
                modelInfo: {
                    rules: []
                },
                userArr: [],
            };
        },
        watch: {
            isChoosePiles (val) {
                this.isChoosePilesProps = true;
            },
            stationData (val) {
                this.stationDataProps = val
                this.getStationList()
            }
        },
        mounted () {
            this.$nextTick(() => {
                document.documentElement.style.minWidth = "1300px";
            });
        },
        created () {
            //获取充电站的列表
            this.getStationList()
        },
        methods: {
            //获取充电站的列表
            getStationList () {
                let that = this;
                //接口请求获取到的数据不为0
                if (this.stationDataProps.length) {
                    let that = this;
                    let _data = this.stationDataProps;
                    that.modelInfo.rules = [];
                    that.all_rules_ids = []
                    _data.forEach(function (e_f) {
                        e_f.is_open = true;//看是否里面还有嵌套层
                        if (e_f.child) {
                            e_f.child.forEach(function (e_s) {
                                that.all_rules_ids.push(e_s.station_id);
                                that.userArr.push({ 'id': e_s.station_id, 'name': e_s.name });
                                if (e_s.checked == 1) {
                                    that.modelInfo.rules.push(e_s.station_id);
                                }
                            });
                        }
                    });
                    this.roleTypeRules = _data;
                    this.checkbox_all =
                        that.modelInfo.rules.length == this.all_rules_ids.length
                            ? true
                            : false;
                }
                this.$emit('updateuserarr', this.userArr)//弹窗被选中的传过去
                this.$emit('updatemodelinfo', this.modelInfo)//输入框里面，编辑时候填的传过去
            },

            // 全选
            handleCheckedAll () {
                this.modelInfo.rules = this.checkbox_all
                    ? []
                    : JSON.parse(JSON.stringify(this.all_rules_ids));
                this.checkbox_all = !this.checkbox_all;
            },
            // 添加/取消 一级目录权限
            addFirstRule (item) {
                let _array = this.modelInfo.rules; //添加取消的数据
                let flag = this.showFirstRule(item);
                if (flag) {
                    item.siblings.map(_citem => {
                        if (_array.indexOf(_citem) != -1) {
                            _array.splice(_array.indexOf(_citem), 1);
                        }
                    });
                } else {
                    item.siblings.map(_citem => {
                        if (_array.indexOf(_citem) == -1) {
                            _array.push(_citem);
                        }
                    });
                }

                this.checkbox_all =
                    _array.length == this.all_rules_ids.length ? true : false;
            },
            // 显示一级目录（全选/部分选中）
            showFirstRule (_menu) {
                if (_menu.siblings) {
                    return _menu.siblings.every(
                        item => this.modelInfo.rules.indexOf(item) != -1
                    );
                }
                return false;
            },
            // // 是否显示二级目录
            // showNavItems(_menu) {
            //     if (_menu.child) {
            //         return _menu.child.some(
            //             item =>
            //             this.modelInfo.rules.indexOf(item.station_id) != -1 && item.is_title == 1
            //         );
            //     }
            //     return false;
            // },
            handleThirdChecked (item) {
                let _array = this.modelInfo.rules;
                if (_array.indexOf(item.station_id) != -1) {
                    _array.splice(_array.indexOf(item.station_id), 1);
                } else {
                    _array.push(item.station_id);
                }
                this.checkbox_all =
                    _array.length == this.all_rules_ids.length ? true : false;
            },
            //选择充电站
            closeStationModel () {
                this.isChoosePilesProps = false;
            },

        },
        destroyed () {
            document.documentElement.style.minWidth = "1200px";
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .sf-model-box {
        /deep/ .box-outer {
            /* padding-right: 0; */
            .box-content {
                padding: 0 !important;
            }
            width: 800px !important;
            padding-top: 24px;
            .box-title {
                padding-top: 0;
            }
            .section-list {
                padding-bottom: 4px;

                &:last-child {
                    padding-bottom: 0;
                }

                .section-left {
                    float: left;
                    font-size: 12px;
                    color: rgba(102, 102, 102, 1);
                    line-height: 36px;
                }

                .section-right {
                    margin-left: 88px;

                    .el-textarea {
                        width: 400px;
                        height: 96px;
                    }

                    .el-date-editor {
                        width: 150px;
                    }

                    .time-text {
                        float: left;
                        padding: 0 12px;
                        font-size: 12px;
                        color: rgba(102, 102, 102, 1);
                        line-height: 36px;
                    }

                    &.time-outer {
                        height: 36px;

                        .el-form-item {
                            float: left;
                        }
                    }

                    .radio-outer {
                        display: flex;
                        height: 36px;
                        align-items: center;

                        .el-radio {
                            padding-right: 32px;
                        }
                    }

                    .coverImg,
                    .add-uploader {
                        width: 236px;
                        height: 98px;
                        background-color: #f5f5f5;
                        border: 1px dashed #e0e0e0;
                        border-radius: 2px;
                    }

                    .add-uploader_tan {
                        width: 74px;
                        height: 98px;
                    }

                    .cover-outer {
                        display: flex;
                        align-items: center;

                        .edit-uploader {
                            margin-left: 24px;
                            width: 82px;
                            height: 36px;
                            line-height: 34px;
                            text-align: center;
                            background: rgba(255, 255, 255, 1);

                            .el-upload {
                                font-size: 12px;
                                border-radius: 3px;
                                color: #333;
                                border: none;
                                border: 1px solid rgba(224, 224, 224, 1);

                                &:hover {
                                    color: $a-hover;
                                    border-color: $a-hover;
                                }
                            }
                        }
                    }

                    .uploader-tips {
                        margin-top: 8px;
                        transform-origin: left;
                        color: #666666;
                    }
                    .uploader-size {
                        margin-top: 0px;
                        color: #999999;
                    }
                }
            }

            .box-bottom {
                padding: 0 202px !important;
                margin-top: 24px;
            }
        }

        .station-check {
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
            .section-item-header {
                span {
                    height: 24px;
                    line-height: 24px;
                }
                border-bottom: 10px;
                padding-top: 24px;

                .section-tips {
                    padding-left: 24px;
                    font-size: 12px;
                    color: rgba(255, 102, 50, 1);
                    line-height: 24px;
                }
            }

            .checkbox-item {
                float: left;
                display: flex;
                align-items: center;
                padding-left: 24px;
                font-size: 12px;
                color: rgba(51, 51, 51, 1);
                line-height: 20px;
                margin-bottom: 8px;

                i {
                    margin-right: 8px;
                }

                &.checkbox-all {
                    font-size: 14px;
                    height: 16px;
                    padding-left: 0;
                }

                &.checkbox-header {
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                    line-height: 24px;
                }

                &.checkbox-header,
                &.checkbox-title {
                    i {
                        margin-right: 12px;
                    }
                }
            }

            .section-main {
                max-height: 541px;
                margin-right: -28px;
                overflow: auto;
                .section-list {
                    &:not(:last-child) {
                        margin-bottom: 12px;
                    }
                    border-radius: 3px;
                    border: 1px solid rgba(224, 224, 224, 1);

                    .list-header {
                        padding: 11px 24px 11px 0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: rgba(238, 238, 238, 1);
                        border-radius: 3px 3px 0 0;

                        .rate-arrow {
                            float: right;
                            display: block;
                            width: 24px;
                            height: 24px;
                            background: url("../assets/img/rate-icon.png") no-repeat;
                            background-size: cover;
                            transform-origin: center;
                            transition: transform 0.2s linear;
                            cursor: pointer;

                            &.rate-arrow-open {
                                transform: rotateZ(180deg);
                            }
                        }
                    }

                    .list-outer {
                        .list-content {
                            display: flex;
                            align-items: center;
                            border-bottom: 1px solid #f0f0f0;

                            &:last-child {
                                border-bottom: none;
                            }

                            .content-left,
                            .content-right {
                                float: left;
                                padding: 12px 0 8px 0;
                                display: flex;
                                align-items: center;
                                flex-wrap: wrap;
                            }

                            .content-left {
                                width: 176px;
                            }

                            .content-right {
                                .checkbox-item {
                                    // padding: 8px 0 8px 24px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //关联充电站
    .el-checkbox {
        margin-top: 10px;
        margin-bottom: 10px;
        // 未选中样式
        /deep/ .el-checkbox__inner {
            border-radius: 0;
            background-color: #ffffff;
        }
        /deep/ .el-checkbox {
            color: #ffffff;
        }
        /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #333333;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #38b487;
            border-color: #38b487;
        }
        /deep/ .el-checkbox__input .el-checkbox__inner {
            border-color: #dcdfe6;
        }
    }

    .ad-station {
        .section-right {
            margin-left: 96px !important;
        }
        .add-uploader {
            width: 301px !important;
            height: 98px !important;
        }
        .el-select {
            width: 252px;
            height: 36px;
        }
    }
    //共用border线，添加活动页面-‘提交’按钮上面的线-覆盖‘活动信息’下面的键
    .section-item-header-acsubmit {
        margin-top: -40px !important;
    }
    .box-title {
        /*margin-left: 20px;*/
    }

    //添加弹窗广告
    .pop-add {
        .section-right {
            margin-left: 76px !important;
            margin-bottom: 24px;
        }
    }
    .pop-add {
        .pop-add-con {
            .section-right {
                /deep/ input {
                    width: 400px;
                    height: 36px;
                }
            }
        }
    }
    .pop-add-pile {
        .section-right {
            position: relative;
            /deep/ .el-form-item {
                width: 400px;
                // height: 36px;
            }
            /deep/ textarea {
                width: 400px;
                height: 36px;
                overflow: hidden;
            }
            .pop-chosee-pile {
                width: 80px;
                height: 36px;
                position: absolute;
                left: 422px;
                top: 0;
                font-size: 12px;
            }
        }
    }
    .scrollBar-station {
        width: 738px;
    }
</style>
