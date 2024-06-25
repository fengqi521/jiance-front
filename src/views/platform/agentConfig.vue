<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/agent">代理商管理</router-link> > {{ type ? '添加' : '编辑' }}手续费配置
    </div>
    <div class="section-container">
      <div class="section-item-header">
        配置信息
      </div>
      <div class="section-bom">
        <el-form class="card-form" ref="card-form" :model="info" :rules="dataRules">
          <div class="card-form-list card-form-service">
            <p class="card-form-label">*<span class="label">充值转账手续费</span></p>
            <el-form-item prop="service_free">
              <el-input v-model="info.service_free"
                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                placeholder="请输入充值转账手续费" />
            </el-form-item>
            <span class="card-form-unit">%</span>
          </div>
          <div class="card-form-list">
            <p class="card-form-label">*<span class="label">银行转账手续费</span></p>
            <el-form-item class="card-form-item" prop="ratio_json">
              <rate-config v-model="info.ratio_json" />
            </el-form-item>
          </div>
        </el-form>
        <div class="btn_succ" @click="handleSubmit">提交</div>
      </div>
    </div>

  </section>
</template>
<script>
import RateConfig from './components/RateConfig'
export default {
  components: { RateConfig },
  data () {
    // 费率必填校验
    const ratioJsonValidate = (rule, value, callback) => {
      if (!value || !value.length) callback(new Error('* 银行转账手续费必填'))
      else callback()
    }
    const type = this.$route.params.type && this.$route.params.type.indexOf('add') > -1
    return {
      type,
      info: {
        service_free: '',
        agent_id: this.$route.params.id || '',
        ratio_json: []
      },
      dataRules: {
        service_free: [{ required: true, message: '* 请输入充值转账手续费', trigger: 'blur' }],
        ratio_json: [
          { required: true, validator: ratioJsonValidate, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (!this.type) this.getDetail()
  },
  methods: {
    getDetail () {
      this.$api.getServiceFeeList({ agent_id: this.info.agent_id }).then(res => {
        if (res.code === 1) {
          this.info.service_free = res.data.ratio
          const lists = res.data.bank_list.map(({ create_time, id, update_time, group_id, ...others }) => others)
          this.$set(this.info, 'ratio_json', lists)
        }
      })

    },

    async handleSubmit () {
      const valid = await this.$refs['card-form'].validate().catch(err => err)
      if (!valid) return;
      let params = { ...this.info, ratio_json: JSON.stringify(this.info.ratio_json) }
      this.$api.addServiceFee(params).then(res => {
        if (res.code === 1) {
          this.$sfNotify({ message: `${this.type ? '添加' : '编辑'}成功` });
          this.$router.push(`/platform/agent`);
          return;
        }

        this.$sfNotify({ duration: 0, type: "error", message: res.message, });
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/platform/agentConfig.scss";
</style>