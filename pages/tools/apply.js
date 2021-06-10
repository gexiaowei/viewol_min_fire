const {
  globalData,
  globalData: { http, expoId, regeneratorRuntime }
} = getApp()

Page({
  data: {
    startTime: null
  },

  onLoad: function ({ companyId }) {
    this.setData({ companyId })
  },

  bindChange: function (event) {
    let tmp = {}
    const {
      currentTarget: {
        dataset: { key }
      },
      detail: { value }
    } = event
    tmp[key] = value
    this.setData(tmp)
  },

  applyActivity: async function () {
    const { title, place, companyId, startTime, content } = this.data
    if (!title || !place || !startTime || !content) return

    wx.showLoading({
      title: '申请中...'
    })

    const {
      data: { status, message }
    } = await wx.pro.request({
      url: `${http}/schedule/applySchedule`,
      method: 'POST',
      data: {
        expoId,
        title,
        place,
        content,
        companyId,
        startTime,
        endTime: startTime
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    wx.hideLoading()

    wx.showToast({
      title: message,
      icon: status === '0000' ? 'success' : 'none',
      duration: 3000
    })
  }
})
