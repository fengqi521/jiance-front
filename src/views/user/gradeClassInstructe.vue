<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBack()"
        >等级管理</span
      >
      <span class="section-title">></span>
      <span class="section-title">等级说明</span>
    </div>
    <div class="section-container instructe-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>等级说明</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer activity-box instructeadd-box-car"
      >
          <div class="section-list">
            <div class="section-left"><span>内容展示</span></div>
            <div class="section-right">
                <el-input
                        class="textarea scrollBar"
                        :style="{'height':textHeight + 'px'}"
                        type="textarea"
                        id="textarea"
                        v-model="content"
                />
              <el-tooltip
                    class="item-pop"
                    content=""
                    placement="right"
                    popper-class="grade-tips"
              >
                <div slot="content" class="slot-content" style="line-height:18px;">
                  <div class="pop-blod">等级说明添加规则：</div>
                  1、等级说明将会展示在APP上，编辑时需要严谨。
                  <br />2、可以将会员等级介绍、可享受的会员权益、如何获得会员权益在文档中说明。
                  <br /> 3、因为整个说明为一个文档，需要做好排版。
                  <div class="pop-blod pop-blod-top">*注意</div>
                  1:“用户等级”是根据用户上个月充电量，在当月月初完成计算并固定，在一个月内不再重新计算。<br/>
                  2：等级对应的权益也是在当前月月初确定“当前等级”后立即发送给用户 ，一个月仅发送一次。
                </div>
                <div class="tips-icon"></div>
            </el-tooltip>
            </div>
          </div>

      </div>
      <div class="section-item-header instructe-header"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <div class="btn_succ" @click="handleUpdate()">
          提交
        </div>
        <div class="btn_cancel" @click="handleBack()">
          取消
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      editor: "",
      content: "",
      //控制文本框大小随着浏览器高度改变
      textHeight:"500",
      screenHeight:window.innerHeight,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1200px";
    });
    // let that = this;
    // this.editor = new E('#toolbar-container',"#textarea");
    // this.editor.config.menus = []
    // this.editor.config.zIndex = 1
    // this.editor.config.onchange = function (newHtml) {
    //   that.content = newHtml;
    // };
    // this.editor.create();

//控制文本框大小随着浏览器高度改变
    window.onresize =()  =>{
        return (()=>{
           window.screenHeight = window.innerHeight
           this.screenHeight = window.screenHeight;
        })()
    }

  },
  watch:{
      screenHeight(val){
         this.screenHeight = val;
         this.textHeight = this.screenHeight - 330;
      }
  },
  created() {
    this.getUpdateDetail();
  },
  methods: {
    getUpdateDetail() {
      this.listLoading = true;
      this.$api.getPlatformDesc({type:1}).then((res) => {
        this.listLoading = false;
        if (res.code == 1) {
          this.content = res.data.desc;
        }
      });
    },
    handleUpdate() {
      this.$api.EditPlatformDesc({desc:this.content,type:1}).then(res=>{
          if (res.code == 1) {
                this.$sfNotify({ message: res.message, type: "success" });
                this.$router.push({ path: "/user/grade" });
          } else {
                this.$sfNotify.error({ message: res.message });
          }
      })
    },
    handleBack(num) {
      this.$router.push({ path: "/user/grade" });
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width:298px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/user/gradeScoreInstructe.scss";
</style>
