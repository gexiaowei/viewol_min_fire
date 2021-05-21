const {
  globalData,
  globalData: { http, expoId, regeneratorRuntime }
} = getApp()

Page({
  data: {
    award: 0,
    category_list: [],
    company_list: [],
    position_list: [
      {
        id: 'W1',
        name: 'W1'
      },
      {
        id: 'W2',
        name: 'W2'
      },
      {
        id: 'W3',
        name: 'W3'
      },
      {
        id: 'W4',
        name: 'W4'
      },
      {
        id: 'E1',
        name: 'E1'
      },
      {
        id: 'E2',
        name: 'E2'
      },
      {
        id: 'E3',
        name: 'E3'
      },
      {
        id: 'E4',
        name: 'E4'
      },
      {
        id: 'E1外',
        name: 'E1',
        is_out: true
      },
      {
        id: 'E2外',
        name: 'E2',
        is_out: true
      },
      {
        id: 'E3外',
        name: 'E3',
        is_out: true
      },
      {
        id: 'E4外',
        name: 'E4',
        is_out: true
      }
    ],
    lastSeq: '',
    keyWord: '',
    hall: '',
    loadding: false,
    showModalStatus: false
  },

  onLoad: function (options) {
    this.getCategoryList()
  },

  onShow: function () {
    this.getCompanyList(true)
  },

  onReachBottom: function () {
    this.getCompanyList()
  },

  onTabItemTap (item) {
    globalData.firefighting_exhibitors_award = 0
  },

  changeCategory: function (event) {
    const id = event.currentTarget.dataset.id
    if (id === this.data.categoryId) {
      this.setData({ categoryId: '' })
    } else {
      this.setData({ categoryId: id })
    }

    this.getCompanyList(true)
  },

  changeHall: function (event) {
    const id = event.currentTarget.dataset.id
    if (id === this.data.hall) {
      this.setData({ hall: '' })
    } else {
      this.setData({ hall: id })
    }

    this.getCompanyList(true)
  },

  changeKeyword: function (event) {
    this.setData({ keyWord: event.detail.value })
    this.getCompanyList(true)
  },

  getCompanyList: async function (is_replace = false) {
    this.setData({ loadding: true })
    const {
      keyWord = '',
      categoryId = '',
      lastSeq,
      company_list,
      award,
      hall
    } = this.data
    let {
      data: { status, result = [], message }
    } = await wx.pro.request({
      url: `${http}/company/listCompany`,
      method: 'GET',
      data: {
        expoId,
        award,
        keyWord,
        categoryId,
        hall,
        lastSeq: is_replace ? '' : lastSeq,
        num: 20
      }
    })

    if (status === '0000') {
      result.forEach(element => {
        if (element.showInfo) {
          element.link = encodeURIComponent(
            `https://www.view-ol.com/zsx/#/?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`
          )
        } else {
          element.link = encodeURIComponent(
            `https://www.view-ol.com/zsx/#/detail?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`
          )
        }
        element.sence = encodeURIComponent(`11:${element.id}`)
      })
      this.setData({
        company_list: is_replace ? result : company_list.concat(result)
      })
      if (result.length)
        this.setData({ lastSeq: result[result.length - 1]['seq'] })
    }

    this.setData({ loadding: false })
  },

  getCategoryList: async function () {
    const {
      data: { status, result = [], message }
    } = await wx.pro.request({
      url: `${http}/category/listCategory`,
      method: 'GET',
      data: {
        parentId: '0003'
      }
    })

    if (status === '0000') {
      this.setData({ category_list: result })
    }
  }
})
