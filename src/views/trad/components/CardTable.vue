<template>
  <div class="card-table">
    <div class="card-head">
      <span class="card-title">充值转账手续费</span>
      <p class="card-rate">{{ rate }}%</p>
    </div>
    <div class="card-body">
      <span class="card-title">银行转账手续费</span>
      <div class="table-body scrollBar">
        <div class="table-tr" v-for="(list, index) in bank_rate" :key="index">
          <div class="table-td">
            <div class="td-item">{{ list.start_amount }}元{{ Number(list.end_amount) ? `至${list.end_amount}元(含)` : '以上金额'
            }}
            </div>
          </div>
          <div class="table-td">
            <div class="td-item">
              {{ list.type === '2' ? `${list.ratio}%/笔 最高` : '' }}收取
              {{ list.type === '2' ? list.each_max_amount : list.each_amount }}元/笔</div>
          </div>
        </div>
        <div v-if="!bank_rate || !bank_rate.length" class="table-tr unData">
          <img :src="require('assets/img/unData.png')" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    separation_rate: {
      type: String,
      default: ''
    },
    bank_rate: {
      type: Array,
      default: () => []
    },

  },
  computed: {
    rate () {
      return (Number(this.separation_rate) * 100).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-table {
  padding: 10px;
  color: #333;
  background: #eee;

  .card-head {
    margin-bottom: 8px;
  }

  .card-rate {
    padding-left: 8px;
    line-height: 28px;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
  }

  .card-title {
    font-size: 14px;
    line-height: 28px;
  }

  .table-body {
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    max-height: 182px;
    overflow-y: auto;
  }

  .table-tr {
    height: 36px;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fff;
    }
  }

  .table-td:last-child {
    border-left: 1px solid #e0e0e0;
  }
}
</style>