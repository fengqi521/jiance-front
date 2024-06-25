// import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

import { Loading } from 'element-ui';

import config from '../../config';

import themeArray from './themeArray';

//封装一些全局元素。如全站通用功能函数和http请求等

export const global = {
    // 测试环境
    // baseUrl:"http://120.76.119.16:8888/jojosns/",
    // baseImgUrl:"http://120.76.119.16:8888/jojosns/",
    // 开发环境
    baseUrl: "http://27.61.80.50:8080/jojosns/",
    baseImgUrl: "http://27.61.80.50:8080/jojosns/", //图片服务器，若没有单独服务，可忽略此项

    staticPath: process.env.NODE_ENV !== 'development' ? config.build.staticPath : config.dev.staticPath,//静态资源路径
    /**
     * 切换主题函数
     */
    changeTheme: function (themeValue) {
        var that = this;
        // console.log('切换主题颜色值：',themeValue,that.staticPath,JSON.stringify(themeArray) );
        //需要移到单独的文件存放
        var cssArray = themeArray;
        removeCss()
        for (let i = 0, len = cssArray.length; i < len; i++) {
            var itemPath = that.staticPath + 'theme/' + themeValue + '/' + cssArray[i].toLowerCase() + '.css';
            loadCss(itemPath)
        };

        localStorage.setItem("themeValue", themeValue)

        function loadCss(path) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.id = 'theme';
            head.appendChild(link);

        }
        function removeCss(href) {
            const links = document.getElementsByTagName("link");
            const head = document.getElementsByTagName('head')[0];
            let arr = []
            if (links && links.length > 0) {
                for (let i = 0, len = links.length; i < len; i++) {
                    if (links[i].getAttribute('id') == 'theme' && links[i]) {
                        arr.push(links[i]);
                    }
                }
                for (let i = 0, len = arr.length; i < len; i++) {
                    head.removeChild(arr[i])
                }
            }
        }
    },
    /**
     * 全局ID计数器，保证返回的是一个全局的id标识（数字）
     */
    globalId: function () {
        return window._idCounter_ ? window._idCounter_ += 1 : window._idCounter_ = 1;
    },
};

export const hour_arr = [
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
];

export const minute_interval_arr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];


export const minute_arr = ['00', '30']