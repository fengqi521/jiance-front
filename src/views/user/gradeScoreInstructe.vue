<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBack()"
        >积分配置管理</span
      >
      <span class="section-title">></span>
      <span class="section-title">积分说明</span>
    </div>
    <div class="section-container instructe-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>积分说明</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer"
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
              >
                <div slot="content" class="slot-content" style="line-height:18px;">
                  <div class="pop-blod">积分说明添加规则：</div>
                  1、积分说明将会展示在APP上，编辑时需要严谨。
                  <br />2、可以将积分获得的条件列出。
                  <div class="pop-blod pop-blod-top">* 例如</div>
                  积分获得介绍：
                  <br />1. 用户登录获得积分：用户每天首次登录青莲安充APP即可获得 2 积分；
                  <br />2. 用户充电得积分：用户在充电站进行充电，充电账单支付后可得相应积分。每个充电站积分根据站点配置决定。
                  <br />1)“AAAA充电站；系统管理员充电站；业主充电站 ”支付后可得 20 积分
                  <br />2)“XX-测试站；XX充电站；AAA停车场；BBB充电站 ”支付后可得 30 积分
                  <br />3)“测试站B；测试站A；测试站C”支付后可得 60 积分
                  <br />3. 如有其他疑问可拨打客服热线。
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
import E from 'wangeditor'
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
    // this.editor = new E("#textarea");
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

    // //js原生方法给某个id下的子div添加class属性，此处是为了添加滚动条
    // document.querySelector('#textarea>div'). classList.add("scrollBar");
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
      this.$api.getPlatformDesc({type:2}).then((res) => {
        this.listLoading = false;
        if (res.code == 1) {
          this.content = res.data.desc;
          // this.editor.txt.html(this.content);
        }
      });
    },
    handleUpdate() {
      // var desc = this.editor.txt.html()
      this.$api.EditPlatformDesc({desc:this.content,type:2}).then(res=>{
        if (res.code == 1) {
          this.$sfNotify({ message: res.message, type: "success" });
          this.$router.push({ path: "/user/grade/score" });
        } else {
          this.$sfNotify.error({ message: res.message });
        }
      })
    },
    handleBack(num) {
      this.$router.push({ path: "/user/grade/score" });
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
