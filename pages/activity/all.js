import util from '../../utils/util.js'

const { globalData, globalData: { http, expoId, regeneratorRuntime } } = getApp()

Page({
    data: {
        schedule_list: []
    },

    onLoad: function(options) {
        this.getScheduleList()
    },

    getScheduleList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/schedule/listSchedule`,
            method: 'GET',
            data: {
                expoId,
                num: 200,
                bbs: 1
            }
        })

        this.setData({ schedule_list: util.groupBy(result, 'sTime') })
    },
})