const {
  globalData,
  globalData: { http, regeneratorRuntime }
} = getApp()

Page({
  data: {
    url: null,
    title: null,
    sence: null
  },
  onShow: async function () {
    const version = wx.getStorageSync('version')
    const user_id = globalData.uid || wx.getStorageSync('uid')
    if (!version) {
      wx.setStorageSync('version', '1')
    }
    if (!user_id) {
      wx.navigateTo({
        url: '../login/page'
      })
    }
  },

  onLoad: async function ({ url, title, sence }) {
    if (title) {
      const decode_title = decodeURIComponent(title)
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

  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: `pages/index/page?scene=${this.data.sence}`,
      success: shareTickets => {},
      fail: function (res) {}
    }
  }
})
