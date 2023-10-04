const {
  globalData: { http, regeneratorRuntime }
} = getApp()
Page({
  data: {
    imgUrls: ['/images/index/news.png'],
    lastSeq: '',
    info_list: [],
    loadding: false
  },
  onLoad: function () {
    this.getInfoList()
  },

  onReachBottom: function () {
    this.getInfoList()
  },

  getInfoList: async function () {
    const { lastSeq, info_list = [] } = this.data

    this.setData({ loadding: true })
    const {
      data: { status, message, result = [] }
    } = await wx.pro.request({
      url: `${http}/info/list`,
      method: 'GET',
      data: {
        classify: 2,
        lastSeq,
        pageSize: 10
      }
    })

    if (status === '0000') {
      this.setData({ info_list: info_list.concat(result) })
      if (result.length)
        this.setData({ lastSeq: result[result.length - 1]['id'] })
    }
    this.setData({ loadding: false })
  },

  goNewsDetail: function (event) {
    const { id, url, title } = event.currentTarget.dataset
    if (url)
      wx.navigateTo({
        url: `../web/page?url=${encodeURIComponent(url)}&title=${title}`
      })
    else
      wx.navigateTo({
        url: `./detail?id=${id}`
      })
  }
})
