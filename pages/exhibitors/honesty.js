const {
  globalData,
  globalData: { honesty_json, expoId, regeneratorRuntime }
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
