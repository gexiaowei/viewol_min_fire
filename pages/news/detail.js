const WxParse = require('../../wxParse/wxParse.js')
const { globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        article: ''
    },

    onLoad: function({ id }) {
        this.getNewDetail(id)
    },

    getNewDetail: async function(id) {
        const { data: { result, status, message } } = await wx.pro.request({
            url: `${http}/info/getInfo`,
            data: { infoId: id }
        })
        if (status === '0000') {
            this.setData(result)
            wx.pro.setNavigationBarTitle({ title: result.title })
            WxParse.wxParse('article', 'html', result.content, this, 5)
        }
    }
})