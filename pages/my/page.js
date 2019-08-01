const { globalData, globalData: { http, regeneratorRuntime } } = getApp()


Page({
    data: {
        url: decodeURIComponent('https://service.ciec.com.cn/ciec_sw/modules/register/preRegm/91819/wechat/zh/n')
    },

    onLoad: async function(options) {
        const { data: { status, result, message } } = await wx.pro.request({
            url: `${http}/fuser/getFuser`,
            method: 'GET',
            data: { userId: globalData.uid }
        })
        if (status === '0000') {
            this.setData(result)
        }
    },

    goMyActivity() {
        globalData.firefighting_activity_self = 1
        wx.switchTab({
            url: '../activity/page',
        });
    }
})