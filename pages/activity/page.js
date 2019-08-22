import util from '../../utils/util.js'

const { globalData, globalData: { http, expoId, regeneratorRuntime } } = getApp()
const sliderWidth = 28; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        year: '2019',
        month: '10',
        tabs: [{
                week: '二',
                date: 15,
            },
            {
                week: '三',
                date: 16,
            },
            {
                week: '四',
                date: 17,
            },
            {
                week: '五',
                date: 18,
            },
            {
                week: '六',
                date: 19,
            },
        ],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        schedule_list: [],
        is_self: null
    },

    onLoad: async function() {
        const res = await wx.pro.getSystemInfo()
        this.setData({
            sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
            sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
    },

    onShow: function() {
        setTimeout(() => {
            if (globalData.firefighting_activity_self != this.data.is_self) {
                this.setData({ is_self: globalData.firefighting_activity_self })
                if (globalData.firefighting_activity_self === 1) this.getSelfScheduleList()
                else this.getScheduleList()
            }
        }, 500)
    },

    onTabItemTap(item) {
        globalData.firefighting_activity_self = 0
    },

    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        this.getScheduleList()
    },

    getScheduleList: async function() {
        const { activeIndex, tabs, year, month } = this.data
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/listSchedule`,
            method: 'GET',
            data: {
                expoId,
                date: `${year}-${month}-${tabs[activeIndex]['date']}`,
                num: 200,
                bbs: 0
            }
        })

        this.setData({ schedule_list: util.groupBy(result, 'sTime') })
    },


    getSelfScheduleList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/queryUserSchedule`,
            method: 'GET',
            data: {
                userId: globalData.uid
            }
        })
        this.setData({ schedule_list: util.groupBy(result, 'sTime') })
    }

});