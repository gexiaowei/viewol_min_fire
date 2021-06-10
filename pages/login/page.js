const {
  globalData,
  globalData: { http, regeneratorRuntime }
} = getApp()

Page({
  data: {
    auth: false,
    code: null,
    ivStr: null,
    nickName: null,
    headPic: null,
    encryptedData: null
  },

  onLoad: async function () {
    const { authSetting } = await wx.pro.getSetting()
    if (authSetting['scope.userInfo']) {
      this.setData({ auth: true })
      this.login()
    }
  },

  login: async function () {
    try {
      const { userInfo } = await wx.pro.getUserInfo()
      const { code } = await wx.pro.login()
      this.setData({
        code,
        nickName: userInfo['nickName'],
        headPic: userInfo['avatarUrl']
      })
      this.setData({ auth: true })
    } catch (error) {
      wx.showToast({
        icon: 'none',
        title: '请先登录，再进行操作'
      })
    }
  },
  channel: async function () {
    wx.switchTab({ url: '../index/page' })
  },

  getPhoneNumber: function ({ detail }) {
    const { encryptedData, iv: ivStr } = detail
    this.loginWithPhone({ encryptedData, ivStr })
  },

  loginWithPhone: async function ({ encryptedData, ivStr }) {
    let { code, nickName, headPic } = this.data
    const {
      data: { status, message, result }
    } = await wx.pro.request({
      url: `${http}/wx/maPhoneLogin`,
      method: 'GET',
      data: {
        code,
        nickName,
        headPic,
        encryptedData,
        ivStr,
        maNum: 3
      }
    })

    if (status === '0000') {
      wx.setStorageSync('uid', result['userId'])
      wx.setStorageSync('sid', result['sessionId'])
      globalData.uid = result.userId
      globalData.sessionId = result.sessionId
      globalData.userJoin = result.userJoin
      if (result.userJoin == 0) {
        wx.redirectTo({
          url:
            '../web/page?url=' +
            encodeURIComponent(globalData.sign_up_url) +
            '&title=报名'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
      // wx.switchTab({ url: "../index/page" })
    } else {
      wx.pro.showToast({
        icon: 'none',
        title: message,
        duration: 1500
      })
    }
  }
})
