const { globalData, globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        url: null,
        title: null,
        sence: null
    },
  onShow: async function () {
    const user_id = wx.getStorageSync('uid')
    if (!user_id && !globalData.uid) {
      wx.navigateTo({
        url: '../login/page'
      })
    }
  },
    
    onLoad: async function({ url, title, sence }) {
        if (title) {
            const decode_title = decodeURIComponent(title);
            wx.setNavigationBarTitle({ title: decode_title })
            this.setData({ title: decode_title })
        }
        const decode_url = decodeURIComponent(url)
        this.setData({ url: decode_url })
        if (sence) {
            const decode_sence = decodeURIComponent(sence)
            this.setData({ sence: decode_sence })
            wx.showShareMenu()
        }

    },

    onShareAppMessage: function(res) {
        return {
            title: this.data.title,
            path: `pages/index/page?scene=${this.data.sence}`,
            success: (shareTickets) => {
                console.info(shareTickets + '成功');
            },
            fail: function(res) {
                console.log(res + '失败');
                // 转发失败
            }
        }
    }
})