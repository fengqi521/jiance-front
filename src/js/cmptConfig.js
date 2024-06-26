export const cmptConfig = {
    // 折线图公共配置
    getCommonEcharts: function (data_x) {
        return {
            // 显示提示框组件，包括提示框浮层和 axisPointer。
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: 'rgba(0,0,0,0.8)'
                    },
                },
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: 2,
                formatter: (params) => {
                    let res = "";
                    let formatterName = "";
                    params.forEach(current => {
                        const {
                            name,
                            color,
                            seriesName,
                            value
                        } = current;
                        const selfMarker = `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;`
                            + `width:6px;height:6px;background-color:${color};"></span>`;

                        formatterName = "<span style='font-weight:bold'>" + name + "</span><br/>";
                        res += selfMarker + seriesName + "<span style='margin-left:24px;float:right'>" + value + "</span><br/>";
                    })
                    return formatterName + res;
                },
                extraCssText: 'padding:12px',
                textStyle: {
                    fontSize: 12
                },
            },
            // 图例组件
            legend: {
                show: true,
                left: 0,
                top: 16,
                padding: [0, 8, 0, 0],
                itemWidth: 20,
                itemHeight: 8,
                selectedMode: true,
                textStyle: {
                    color: "#333"
                },
            },
            // 直角坐标系内绘图网格
            grid: {
                show: true,
                top: '76',
                left: 0,
                right: 8,
                bottom: 16,
                containLabel: true,
                borderColor: 'transparent'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                minInterval: 7200,
                data: data_x,
                // 坐标轴刻度相关设置。
                axisTick: {
                    show: false
                },
                // 坐标轴线设置。
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#CCC',
                    }
                },
                // 坐标轴刻度标签的相关设置
                axisLabel: {
                    color: '#666',
                    fontSize: 12
                },
                // 坐标轴在 grid(网格) 区域中的分隔线。
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                // 坐标轴刻度相关设置。
                axisTick: {
                    show: false
                },
                // 坐标轴线设置。
                axisLine: {
                    show: false
                },
                // 坐标轴刻度标签的相关设置
                axisLabel: {
                    color: '#999',
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#ECECEC',
                        width: 1,
                    }
                },
            }, {
                type: "value",
                // 坐标轴刻度相关设置。
                axisTick: {
                    show: false
                },
                // 坐标轴线设置。
                axisLine: {
                    show: false
                },
                // 坐标轴刻度标签的相关设置
                axisLabel: {
                    color: "#999"
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#ECECEC",
                        width: 1
                    }
                }
            }],
            series: []
        }
    },
    // 柱状图公共配置
    getCommonBars: function (data_x) {
        return {
            // 显示提示框组件，包括提示框浮层和 axisPointer。
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "none",
                    label: {
                        background: 'rgba(0, 0, 0, 0.8)'
                    },
                    crossStyle: {
                        color: "#FFFFFF"
                    }
                }
            },
            legend: {
                itemWidth: 24,
                itemHeight: 12,
                data: ['在线', '总量'],
                x: "left",
                itemGap: 16
            },
            // 直角坐标系内绘图网格
            grid: {
                show: true,
                top: "16",
                right: "3%",
                bottom: 0,
                borderColor: "transparent"
            },
            xAxis: [{
                type: "value",
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                type: "category",
                data: data_x,
                // 坐标轴在 grid(网格) 区域中的分隔线。
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            }],
            series: [{
                name: '在线',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight',
                        textStyle: {
                            color: '#000',
                        }
                    }
                },
                barGap: '35%',
                barCategoryGap: '35%',
                color: ['rgba(77, 84, 169, 0.8)'],
            },
                {
                    name: '总量',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            // position: 'insideRight',
                            position: 'right',
                            textStyle: {
                                color: '#000',
                            },
                            formatter: function (params) {
                                for (var i = 0, l = option.yAxis['data'].length; i < l; i++) {
                                    if (option.yAxis['data'][i] == params.name) {
                                        return option.series[0].data[i] + params.value;
                                    }
                                }
                            },
                        }
                    },
                    barGap: '40%',
                    barCategoryGap: '40%',
                    color: ['#e2e8ec'],
                }
            ]

        };
    },
    // 饼图公共配置
    getCommonPie: function () {
        return {
            //手动设置每个图例的颜色
            legend: {
                show: true,
                left: 0,
                top: 16,
                itemWidth: 10,
                itemHeight: 10,
                icon: 'roundRect',
                borderRadius: 2,
                selectedMode: true,
                textStyle: {
                    color: '#333',
                },
            },
            tooltip: {
                show: true,
                formatter: '{a}<br/>{b}:{c}（{d}%）'
            },

            series: [ //系列列表
                {
                    name: '运行状态',
                    type: 'pie',
                    legendHoverLink: true,
                    avoidLabelOverlap: false,
                    hoverOffset: 4,
                    radius: ["43%", "60%"],
                    center: ['50%', '55%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            show: true,
                            position: 'center',
                            color: '#222222',
                            formatter: [
                                '{title|{b}}',
                                '{value|{d}%}'
                            ].join('\n'),
                            rich: {
                                title: {
                                    fontSize: 14,
                                    color: '#666',
                                    lineHeight: 20
                                },
                                value: {
                                    fontSize: 20,
                                    color: '#666',
                                    fontWeight: 'bold',
                                    lineHeight: 24
                                }
                            }
                        }
                    },
                    labelLine: {
                        show: false,
                    },
                    tooltip: {
                        show: true,
                        formatter: '{a}<br/>{b}:{c}（{d}%）'
                    },
                },
            ]
        }
    },

    //堆叠柱状图配置
    getCommonStackBar: function () {
        return {
            animation: false,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(37,55,118,.12)',
                        type: 'solid',
                        width: 60
                    },
                    z: -1
                },
                formatter: (params) => {
                    let res = "";
                    let formatterName = "";
                    params.reverse().forEach(current => {
                        const {
                            name,
                            color,
                            seriesName,
                            value
                        } = current;
                        const selfMarker = `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;`
                            + `width:6px;height:6px;background-color:${color};"></span>`;

                        formatterName = "<span style='font-weight:bold'>" + name + "</span><br/>";
                        res += selfMarker + seriesName + "<span style='float:right'>" + value  + "</span><br/>";
                    })
                    return formatterName + res;
                },
                extraCssText: 'width:174px;padding:12px',
                textStyle: {
                    fontSize: 12
                },
            },
            legend: {
                itemHeight: 10,
                itemWidth: 10,
                itemGap: 16,
                left: 0,
                top: 16,
                padding: 0,
                textStyle: {
                    padding: [4, 0, 0]
                },
                data: [],
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: 16,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#CCC',
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#666'
                },
                data: []
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#ECECEC'
                    }
                }
            },
            series: []
        };
    }
}
