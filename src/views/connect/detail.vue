<template>
  <section>
    <div class="section-title">
      <router-link to="/connect/operator">运营商授权</router-link> > 运营商详情
    </div>
    <div class="section-name" v-if="third.access_type == 1">对接关系：互联互通</div>
    <div class="section-name" v-else-if="third.access_type == 2">对接关系：接入</div>
    <div class="section-name" v-else-if="third.access_type == 3">对接关系：授权</div>
    <div class="section-name" v-else>对接关系：--</div>
    <div class="section-list">
      <div class="section-item-header clearfix">
        <span>运营商信息</span>
      </div>
      <div class="section-content clearfix">
        <div class="content-item">
          <div class="content-left">名称：</div>
          <div class="content-right ellipsis">{{third.title ? third.title :'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">公司地址：</div>
          <div class="content-right ellipsis">{{third.operator_reg_address?third.operator_reg_address:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">对接平台：</div>
          <div class="content-right ellipsis">{{third.operator_name?third.operator_name:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">组织机构代码：</div>
          <div class="content-right ellipsis">{{third.operator_id?third.operator_id:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">公司简称：</div>
          <div class="content-right ellipsis">{{third.operator_note ? third.operator_note:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">联系人：</div>
          <div class="content-right ellipsis">{{third.operator_people?third.operator_people:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">联系电话：</div>
          <div class="content-right ellipsis">{{third.operator_tel?third.operator_tel:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">URL地址：</div>
          <div class="content-right ellipsis">{{third.operator_url?third.operator_url:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">第三方消息密钥(DataSecret)：</div>
          <div class="content-right ellipsis">{{third.data_secret?third.data_secret:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">第三方运营商密钥(OperatorSecret)：</div>
          <div class="content-right ellipsis">{{third.operator_secret?third.operator_secret:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">第三方消息密钥初始化向量(DataSecretlV)：</div>
          <div class="content-right ellipsis">{{third.data_secret_iv?third.data_secret_iv:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">第三方签名密钥(SigSecret）：</div>
          <div class="content-right ellipsis">{{third.sig_secret?third.sig_secret:'--'}}</div>
        </div>
      </div>
    </div>
    <div class="section-list">
      <div class="section-item-header clearfix">
        <span>平台信息</span>
      </div>
      <div class="section-content clearfix">
        <div class="content-item">
          <div class="content-left">名称：</div>
          <div class="content-right ellipsis">{{self.title ? self.title :'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">公司地址：</div>
          <div class="content-right ellipsis">{{self.operator_reg_address?self.operator_reg_address:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">对接平台：</div>
          <div class="content-right ellipsis">{{self.operator_name?self.operator_name:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">组织机构代码：</div>
          <div class="content-right ellipsis">{{self.operator_id?self.operator_id:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">公司简称：</div>
          <div class="content-right ellipsis">{{self.operator_note ? self.operator_note:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">联系人：</div>
          <div class="content-right ellipsis">{{self.operator_people?self.operator_people:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">联系电话：</div>
          <div class="content-right ellipsis">{{self.operator_tel?self.operator_tel:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">URL地址：</div>
          <div class="content-right ellipsis">{{self.operator_url?self.operator_url:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">消息密钥(DataSecret)：</div>
          <div class="content-right ellipsis">{{self.data_secret?self.data_secret:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">运营商密钥(OperatorSecret)：</div>
          <div class="content-right ellipsis">{{self.operator_secret?self.operator_secret:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">消息密钥初始化向量(DataSecretlV)：</div>
          <div class="content-right ellipsis">{{self.data_secret_iv?self.data_secret_iv:'--'}}</div>
        </div>
        <div class="content-item">
          <div class="content-left">签名密钥(sigSecret）：</div>
          <div class="content-right ellipsis">{{self.sig_secret?self.sig_secret:'--'}}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id ? this.$route.params.id : 0,
      self:{},
      third:{}
    };
  },
  created(){
      this.getDetail();
  },
  methods: {
      getDetail:function () {
          var that = this;
          this.$api.getConnectDetail({'id':this.id}).then(res=>{
              if(res.code){
                  that.self = res.data.self
                  that.third = res.data.third
              }
          })
      }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/connect/detail.scss";
</style>
