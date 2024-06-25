<template>
  <transition name="fade">
    <div v-if="showModel" class="model">
      <div class="box-outer">
        <img class="cancel" :src="require('assets/img/cancel.png')" @click="handleCancel" />
        <div class="box-title">选择车型</div>
        <div class="box-search">
          <el-input v-model="words" placeholder="关键字搜索" />
          <span class="btn_succ" @click="searchOwners">搜索</span>
        </div>
        <div class="box-main">
          <div class="box-list box-search-word">
            <div class="box-list-title title-common-2" style="width:90px;">查找：</div>
            <div class="box-content box-car-list">
              <span
                :class="['car-list', brand == activeFindWord ? 'find-word' : '']"
                @click="changeFindWord(brand)"
                v-for="(brand,index) in car_word"
                :key="brand + index"
              >{{brand}}</span>
            </div>
          </div>
          <div class="box-list">
            <div class="box-list-title box-list-brand">品牌：</div>
            <div class="box-content box-car-list" v-if="car_brand.length">
              <span
                v-show="car_brand.length == 0 ? false : true"
                :class="['car-list word-brand-list', brand.id == activeBrand ? 'find-word' : '']"
                @click="changeWordList(brand)"
                v-for="brand in car_brand"
                :key="brand.id"
              >{{brand.name}}</span>
            </div>
            <!-- <div class="box-content box-car-list" v-else>
              <span class="car-list word-brand-list">暂无数据</span>
            </div> -->
            <div class="table-tr unData unData-brand" v-else>
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <div class="box-list box-list-bg type-border">
            <div class="box-list-title title-common-1">车型：</div>
            <div class="box-content box-car-list box-list-type" v-if="!isShowUnData">
              <span
                v-show="car_type.length == 0 ? false : true"
                @click="changeType(brand)"
                :class="['car-list', brand.id == activeType ? 'brand-type-common' : '']"
                v-for="brand in car_type"
                :key="brand.id"
              >{{brand.name}}</span>
            </div>
            <div class="table-tr unData unData-type" v-if="isShowUnData">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="box-btn">
          <div class="btn_succ" @click="saveInfo">确认</div>
          <div class="btn_cancel" @click="handleCancel">取消</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import logVue from "../../device/log.vue";
export default {
  props: {
    showModel: {
      type: Boolean,
    },
    station_name: {},
    station_id: {},
  },
  data() {
    return {
      words: "",
      ISsearchResult: true,
      radio_id: "-1",
      tableData: [],
      Isexpand: false, //点击  全部  和  收起
      activeBrand: "", //点中哪个品牌
      activeWordBrand: "", //点中哪个品牌  汉字
      activeType: "", //点中哪个车型
      activeWordName: "", //点中哪个车型  汉字
      activeWordId: "",
      activeFindWord: "A", //点中哪个单词
      activeWordList: "", //点中单词，下面的车型
      isShowUnData: false, //是否显示暂无数据

      car_brand: [],
      car_word: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      car_word_brand: [],
      car_type: [],
    };
  },
  created() {
    this.getCarBrandList();
//    this.getCarWordList();
  },
  methods: {
    changeWordList(val) {
      this.activeWordList = val.id;
      this.activeBrand = val.id;
      this.activeWordBrand = val.name
      this.car_type = [];
      this.getCarTypeList();
    },
    changeFindWord(val) {
      this.activeFindWord = val;
      this.getCarBrandList()
    },
    changeType(index) {
      this.activeType = index.id;
      this.activeWordName = index.name;
    },
    changeBrand(index) {
      this.activeBrand = index.id;
      this.activeWordBrand = index.name;
      this.car_type = [];
      this.getCarTypeList();
    },
    searchOwners() {
      this.isShowUnData = false;
      this.getSearchBrand();
    },
    getSearchBrand() {
      var that = this;
       that.car_brand = [];
      if (this.words != "") {
        this.$api.getVehicleSearchBrand({ search: this.words }).then((res) => {
            if(res.data.length){
                res.data.map((value) => {
                    that.car_brand.push({ name: value.name, id: value.id,initials:value.initials });
                });
                that.activeBrand = that.car_brand[0].id;
                that.activeWordBrand = that.car_brand[0].name;
                that.activeFindWord = that.car_brand[0].initials;
                that.getCarTypeList();
            }else{
                that.car_brand = [];
                that.activeBrand = '';
                that.activeWordBrand = '';
                that.isShowUnData = true;
                that.activeType = '';
                that.activeWordName = '';
            }
        });
      }
    },
    // 按照字母查询车品牌
    getCarBrandList() {
      var that = this;
      that.car_brand = [];
      this.$api.getVehicleChooseBrand({ initials: this.activeFindWord }).then((res) => {
        if (res.code == 1) {
          if(res.data.length){
              res.data.map((value) => {
                  that.car_brand.push({ name: value.name, id: value.id,initials:value.initials });
              });
              that.activeBrand = that.car_brand[0].id;
              that.activeWordBrand = that.car_brand[0].name;
              that.activeFindWord = that.car_brand[0].initials;
              that.getCarTypeList();
          }else{
              that.car_brand = [];
              that.activeBrand = '';
              that.activeWordBrand = '';
              that.isShowUnData = true;
              that.activeType = '';
              that.activeWordName = '';
          }

        }
      });
    },
    //车品牌成功获取--获取对应车型
    getCarTypeList() {
      var that = this
      that.car_type =[]
      this.$api
        .getVehicleChooseType({ parent_id: this.activeBrand })
        .then((res) => {
          if (res.code == 1) {
            if(res.data.length){
                that.isShowUnData = false;
                res.data.map((value) => {
                    that.car_type.push({ name: value.name, id: value.id });
                });
                that.activeType = that.car_type[0].id;
                that.activeWordName = that.car_type[0].name;
            }else{
                that.isShowUnData = true;
                that.activeType = '';
                that.activeWordName = '';
            }
          }
        });
    },
    stationChangeSelect(index) {
      if (this.tableData[index]) {
        this.$emit("update:station_name", this.tableData[index].station_name);
        this.$emit("update:station_id", this.tableData[index].station_id);
      } else {
        this.$emit("update:station_name", "");
        this.$emit("update:station_id", "");
      }
    },
    handleCancel() {
      this.isShowUnData = false;
      this.$emit("update:showModel", false);
    },
    saveInfo() {
      this.isShowUnData = false;
      this.$emit("update:showModel", false);
      // this.$emit("update:activeWordName", this.activeWordName);
      if(this.car_brand != 0){
        this.activeWordId = this.car_brand[0].id
      }
      this.$emit("activeWordName", this.activeWordName, this.activeWordBrand);
    },
  },
};
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.box-outer {
  position: absolute;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  padding: 0 32px 32px;
  background: rgba(255, 255, 255, 1);
  transform-origin: center;
  border-radius: 4px;

  .cancel {
    display: block;
    position: absolute;
    top: -40px;
    right: 0;
    width: 28px;
    height: 28px;
    cursor: pointer;
  }

  .box-title {
    padding: 24px 0;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }

  .box-search {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-input {
      width: 320px;
    }
    .btn_succ {
      margin-left: 24px;
      width: 72px;
      font-size: 12px;
      float: none;
    }
  }

  .box-main {
    padding: 24px 0 24px;

    .box-list-title {
      width: 70px;
      padding: 24px 0px 24px 24px;
      font-size: 14px;
    }
    .box-list-brand{
      font-size: 12px;
      color: #666666;
    }
    .box-content {
      padding: 18px 10px 8px 0;
      color: #666666;
    }
  }
  .title-common-1 {
    /* height: 24px; */
    width: 70px;
    color: #333333 !important;
    /* line-height: 24px; */
  }
  .title-common-2 {
    font-size: 14px !important;
    color: #333333 !important;
  }
  .type-border {
    border-top: 1px solid #e0e0e0;
  }
  //收起  按钮
  .shou-expand {
    margin-top: 14px;
    cursor: pointer;
    color: #CAA040 !important;
  }
  .shou-expand:before {
    content: " ";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-width: 1px 1px 0 0;
    border-color: #CAA040;
    border-style: solid;
    -webkit-transform: matrix(0.71, -0.71, 0.71, 0.71, 0, 0);
    transform: matrix(0.71, -0.71, 0.71, 0.71, 0, 0);
    position: absolute;
    margin: 8px 0 0 40px;
  }
  .shou-all {
    margin-top: 14px;
    cursor: pointer;
    color: #CAA040 !important;
  }
  .shou-all:before {
    content: " ";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-width: 1px 1px 0 0;
    border-color: #CAA040;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0);
    position: absolute;
    margin: 4px 0 0 40px;
  }
  span {
    cursor: pointer;
  }
  //品牌喝车型选中的颜色
  .brand-type-common {
    background: #0087FF;
    color: white;
    border-radius: 2px;
  }
  //查找字母被选中的颜色
  .find-word {
    color: #0087FF;
    font-weight: bold;
    background: rgba(0, 135, 255, 0.1);
  }
  .box-list-type{
    width: 665px;
    font-size: 14px;
  }
  .unData {
    background: #eeeeee;
  }
  .unData-brand{
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: none;
    background: transparent;
  }
  .unData-type{
    margin-left: 256px;
    /* border-top: 1px solid #E0E0E0; */
  }
  .box-list {
    display: flex;
  }
  .box-car-list-brand {
    width: 540px;
  }
  .box-car-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    .car-list {
      margin: 2px 6px 6px;
      width: auto;
      padding: 4px 7px 4px;
    }
  }
  .box-list-type{
    .car-list{
      margin: 2px 6px 10px;
    }
  }
  .box-search-word {
    background: #eeeeee;
    span {
      width: 24px !important;
      height: 24px;
      line-height: 1;
      text-align: center;
      font-size: 14px;
    }
  }
  .word-brand-list {
    font-size: 12px;
  }
  .box-list-bg {
    width: 736px;
    background: #eeeeee;
  }

  .box-btn {
    padding: 0 202px;
    display: flex;
    justify-content: space-between;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>