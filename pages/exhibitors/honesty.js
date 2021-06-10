const {
  globalData: { honesty_json, pixelRatio, regeneratorRuntime }
} = getApp()

Page({
  data: {
    companyList: [],
    show: {},
    loadding: false
  },

  onLoad: function (options) {
    this.getCompanyList()
  },

  getRealHeight (rpx, length) {
    return (
      Math.ceil(rpx[0] / pixelRatio) * length + Math.ceil(rpx[1] / pixelRatio)
    )
  },

  getCompanyList: async function () {
    this.setData({ loadding: true })
    const show = []
    const {
      data: { list = [] }
    } = await wx.pro.request({
      url: honesty_json,
      method: 'GET'
    })
    list.forEach((category, index) => {
      category.year = /\d{4}年/.exec(category.name)[0]
      category.name = category.name.replace(/\d{4}年/, '')
      // category.height =
      //   this.getRealHeight([115, 2], category.list.length) + 'px'
      show.push(false)
      category.list.forEach(company => {
        company.star = company.star.split('')
      })
    })
    this.setData({ companyList: list, loadding: false, show })
  },

  toggleCollapse (event) {
    const index = event.currentTarget.dataset.index
    this.data.show[index] = !this.data.show[index]
    this.setData({ show: this.data.show })
    // this.setData({:})
  }
})
