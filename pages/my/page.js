const app = getApp()
const {
  globalData,
  globalData: { http, regeneratorRuntime }
} = getApp()

Page({
  data: {
    url: decodeURIComponent(globalData.sign_up_url)
  },

  onShow: async function (options) {
    const {
      data: { status, result, message }
    } = await wx.pro.request({
      url: `${http}/fuser/getFuser`,
      method: 'GET',
      data: { userId: globalData.uid }
    })
    if (status === '0000') {
      this.setData(result)
    }
  },

  goMyActivity () {
    const user_id = wx.getStorageSync('uid')
    if (!user_id) {
      wx.navigateTo({
        url: '../login/page'
      })
      return
    }
    globalData.firefighting_activity_self = 1
    wx.switchTab({
      url: '../activity/page'
    })
  }
})
