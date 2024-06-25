<template>
  <section>
    <div class="section-title">企业信息</div>
    <div v-loading="listLoading">
      <div class="section-list">
        <div class="section-item-header">
          <span>基本信息</span>
          <span class="btn_recovery" @click="showPasswordModel=true"><i class="edit-amount"></i>重置密码</span>
        </div>
        <div class="base-info clearfix">
          <div class="info-item">
            <div class="info-left">企业账号</div>
            <div class="info-right ellipsis">{{modelInfo.account}}</div>
          </div>
          <div class="info-item">
            <div class="info-left">联系人</div>
            <div class="info-right ellipsis">{{modelInfo.user_name}}</div>
          </div>
          <div class="info-item">
            <div class="info-left">联系电话</div>
            <div class="info-right ellipsis">{{modelInfo.tel}}</div>
          </div>
          <div class="info-item">
            <div class="info-left">联系邮箱</div>
            <div class="info-right ellipsis">{{modelInfo.email}}</div>
          </div>
          <div class="info-item">
            <div class="info-left">状态</div>
            <div class="info-right ellipsis" v-if="modelInfo.status == 1">开启</div>
            <div class="info-right ellipsis" v-else>关闭</div>
          </div>
          <div class="info-item">
            <div class="info-left">当前子账号</div>
            <div class="info-right ellipsis">{{modelInfo.child_count}}个</div>
          </div>
          <div class="info-item">
            <div class="info-left">一号多充限额</div>
            <div class="info-right ellipsis">{{modelInfo.limit_amount}} 元</div>
          </div>

        </div>
      </div>
      <!--
      <div class="section-list">
        <div class="section-item-header">
          <span>消费信息</span>
        </div>
        <div class="spend-info clearfix">
          <div class="info-item">
            <div class="spend-left">
              <div class="spend-left-top">账户余额</div>
              <div class="spend-left-bottom">
                <span style="color:#D3B050;">{{userInfo.balance ? userInfo.balance/100 : 0}}</span>元
              </div>
            </div>
            <div class="balance-img"></div>
          </div>
          <div class="info-item-center">
            <div class="info-item">
              <div class="spend-left">
                <div class="spend-left-top">充值总计</div>
                <div class="spend-left-bottom">
                  <span style="color:#D3B050;">{{userInfo.recharge ? userInfo.recharge/100 : 0}}</span>元
                </div>
              </div>
              <div class="recharge-img"></div>
            </div>
          </div>
          <div class="info-item">
            <div class="spend-left">
              <div class="spend-left-top">消费总计</div>
              <div class="spend-left-bottom">
                <span style="color:#D3B050;">{{userInfo.consumes ? userInfo.consumes/100 : 0}}</span>元
              </div>
            </div>
            <div class="spend-img"></div>
          </div>
        </div>
      </div>
      -->
    </div>
    <!-- 修改登录密码 -->
    <div
      is="editPasswordModel"
      :showModel.sync="showPasswordModel"
    ></div>
  </section>
</template>

<script>
import editPasswordModel from "../info/components/editPasswordCompany";
export default {
  components: {
    editPasswordModel
  },
  data() {
    return {
      listLoading: false,
      tableData: [],
      showPasswordModel: false,
      modelInfo:{
          user_name:'--',
          email:'--',
          account:'--',
          tel:'--',
          child_count:'0',
          status:'0',
          limit_amount:'0'
      },
      userInfo:{
          balance:'0',
          recharge:'0',
          consumes:'0'
      }
    };
  },
  created(){
      this.getCompanyDetail()
  },
  methods: {
      getCompanyDetail:function () {
        this.listLoading = true;
        var that = this;
        this.$api.getCompanyDetail({}).then(res=>{
          this.listLoading = false;
          that.modelInfo = res.data.list;
          that.userInfo  = res.data.user;
        })
      }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/company/index.scss";
</style>
