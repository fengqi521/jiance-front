<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/agent">代理商管理</router-link> > 添加收款信息
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">收款账号</div>
          <div class="header-right">
            <el-input class="search-input" v-model="searchParams.recipient_account" placeholder="输入收款账号" />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">收方户名</div>
          <div class="header-right">
            <el-input class="search-input" v-model="searchParams.recipient_name" placeholder="输入收方户名" />
          </div>
        </div>

        <div class="content-item">
          <div class="btn_succ" @click="handleSearch">查询</div>
          <div class="btn_cancel" @click="resetSearch">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>收款信息列表</span>
        <div class="btn_succ add-coupon" @click="handleClickInfoShowModal()">
          <i class="add-station"></i>添加收款信息
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">收方户名</div>
            <div class="table-td">收方账号</div>
            <div class="table-td">开户行名称</div>
            <div class="table-td">收方手机号</div>
            <div class="table-td">收款比率（%）</div>
            <div class="table-td" style="min-width:156px;">操作</div>
          </div>
          <div class="table-body" v-loading="isLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(owner, i) in tableData" :key="i">
              <div class="table-td">
                <div class="td-item">{{ owner.recipient_name }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.recipient_account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.bank_name }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.recipient_phone }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.withdrawal_ratio }}</div>
              </div>
              <div class="table-td table-operate" style="min-width:156px;">
                <el-tooltip content="编辑" placement="top">
                  <span class="td-item edit-icon" @click="handleClickInfoShowModal(owner)"></span>
                </el-tooltip>
                <el-tooltip content="删除">
                  <span class="td-item delete-icon" @click="handleClickDeleteShow(owner)"> </span>
                </el-tooltip>

              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- 添加/编辑收款人信息 -->
    <sf-modelBox class="add-card-modal" :showModel.sync="showBillStatus" :title="`${info && info.id ? '编辑' : '添加'}收款人信息`"
      @change="handleSaveBillInfo">
      <el-form :model="info" ref="info" :rules="dataRules">
        <div class="box-list">
          <div class="box-left"><i>*</i>收方户名</div>
          <div class="box-right">
            <el-form-item prop="recipient_name">
              <el-input v-model="info.recipient_name" :maxlength="100" placeholder="请输入收方户名" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>开户行</div>
          <div class="box-right">
            <el-form-item>
              <el-radio class="bank-radio" v-model="info.is_cmb" label="1">招商银行</el-radio>
              <el-radio v-model="info.is_cmb" label="0">其他银行</el-radio>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>收方账号</div>
          <div class="box-right">
            <el-form-item prop="recipient_account"
              :rules="info.is_cmb === '1' ? dataRules.recipient_account : dataRules.recipient_account_general">
              <el-input v-model="info.recipient_account" :maxlength="35"
                oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value<0)value=null"
                placeholder="请输入收方账号" />
            </el-form-item>
          </div>
        </div>

        <div class="box-list">
          <div class="box-left"><i>*</i>开户行名称</div>
          <div class="box-right">
            <el-form-item prop="bank_name">
              <el-input v-model="info.bank_name" :maxlength="30" placeholder="请输入开户行名称" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>收方手机号</div>
          <div class="box-right">
            <el-form-item prop="recipient_phone">
              <el-input v-model="info.recipient_phone" placeholder="请输入手机号码" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>提现比率</div>
          <div class="box-right">
            <el-form-item prop="withdrawal_ratio">
              <el-input class="modal-input-rate" v-model.number="info.withdrawal_ratio"
                oninput="if(!/^[0-9]+$/.test(value)) value=value.replace(/\D/g,'');if(value>100)value=100;if(value<0)value=null"
                placeholder="请输入提现比率" />
              <span class="modal-unit">%</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox :showModel.sync="showDelete" title="删除确认" type="delete" @change="handleClickDelete">
      <p>是否确定删除收款卡号？</p>
      <!-- {{ deleteItem.card }} -->
    </sf-modelBox>
  </section>
</template>

<script>
import { validateCMBCard, isPhone } from '@/utils/validate'
export default {
  data () {
    //验证招商卡号
    const validateCard = (rule, value, callback) => {
      if (!validateCMBCard(value)) callback(new Error('* 收方账号非招商卡'))
      else callback()
    }
    //手机号
    const validateTelephone = (rule, value, callback) => {
      if (!isPhone(value)) callback(new Error('* 手机号格式错误'))
      else callback()

    }
    return {
      isLoading: false,
      searchParams: {
        id: this.$route.params.id,
        recipient_name: "",
        recipient_account: ""
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      showDelete: false,
      deleteItem: null,
      showBillStatus: false,
      info: {
        is_cmb: '1',
        recipient_name: '',
        recipient_account: '',
        bank_name: '',
        recipient_phone: '',
        withdrawal_ratio: ''
      },
      dataRules: {
        recipient_name: [{ required: true, message: "* 请输入收方户名", trigger: ['blur', 'change'] }],
        recipient_account: [{ required: true, message: '* 请输入收方账号', trigger: ['blur', 'change'] },
        { validator: validateCard, trigger: 'blur' }
        ],
        recipient_account_general: [{ required: true, message: '* 请输入收方账号', trigger: ['blur', 'change'] },
        ],
        bank_name: [{ required: true, message: '* 请输入开户行名称', trigger: ['blur', 'change'] }],
        recipient_phone: [
          { required: true, message: '* 请输入收方手机号', trigger: ['blur', 'change'] },
          { validator: validateTelephone, trigger: 'blur' },
        ],
        withdrawal_ratio: [{ required: true, message: '* 请输入提现比率', trigger: ['blur', 'change'] }]
      }
    };
  },
  created () {
    this.getTableDataList();
  },
  watch: {
    'info.is_cmb' (val) {
      console.log(val, '==')
      if (val === '0') this.$refs['info'] && this.$refs['info'].clearValidate('recipient_account')
    }
  },
  methods: {
    // 获取数据
    getTableDataList () {
      this.isLoading = true;
      this.searchParams.page = this.currentPage;
      this.$api.getAgentCollect(this.searchParams).then(data => {
        this.isLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    handleSearch () {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch () {
      this.searchParams = {
        id: this.$route.params.id,
        recipient_name: "",
        recipient_account: ""
      }
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },

    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },


    //点击显示收款信息
    handleClickInfoShowModal (list) {
      if (list) {
        const { agent_id, ...others } = list;
        this.info = { ...others };
      } else {
        this.info = {
          is_cmb: '1',
          recipient_name: '',
          recipient_account: '',
          bank_name: '',
          recipient_phone: '',
          withdrawal_ratio: ''
        }
      }

      this.showBillStatus = true;
    },

    // 添加/编辑收款信息
    async handleSaveBillInfo () {
      const valid = await this.$refs['info'].validate().catch(error => error)
      if (!valid) return;
      const { id } = this.info;
      // 修改
      if (id) {
        this.$api.editAgentCollectInfo(this.info).then(res => {
          if (res.code === 1) {
            this.$sfNotify({ message: "修改成功" });
            this.showBillStatus = false;
            this.handleSearch()
          } else {
            this.$sfNotify({
              duration: 0,
              type: 'error',
              message: res.message
            })
          }

        })
        return;
      }

      //添加
      this.$api.addAgentCollectInfo({ ...this.info, id: this.searchParams.id }).then(res => {
        if (res.code === 1) {
          this.$sfNotify({ message: "添加成功" });
          this.showBillStatus = false;
          this.handleSearch()
        } else {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: res.message
          })
        }
      })

    },

    handleClickDeleteShow (list) {
      this.deleteItem = list;
      this.showDelete = true;
    },

    // 确认删除
    handleClickDelete () {
      this.$api.deleteAgentCollectInfo({ id: this.deleteItem.id }).then(data => {
        if (data.code == 1) {
          this.$sfNotify({ message: "删除成功" });
          this.showDelete = false;
          setTimeout(this.handleSearch(), 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message
          });
        }
      });
    },

  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/platform/owner.scss";
@import "../../assets/css/platform/agentCard.scss"
</style>
