const {
  globalData: { http, regeneratorRuntime, expoId }
} = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    award: null,
    product_list: [],
    category_list: [],
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
    hall: '',
    keyWord: '',
    loadding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ award }) {
    console.log(award)
    if (award) this.setData({ award })
    this.getCategoryList()
    this.getProductList()
  },

  onReachBottom: function () {
    this.getProductList()
  },

  changeCategory: function (event) {
    const id = event.currentTarget.dataset.id
    if (id === this.data.categoryId) {
      this.setData({ categoryId: '' })
    } else {
      this.setData({ categoryId: id })
    }
    this.getProductList(true)
  },

  changeHall: function (event) {
    const id = event.currentTarget.dataset.id
    if (id === this.data.hall) {
      this.setData({ hall: '' })
    } else {
      this.setData({ hall: id })
    }

    this.getProductList(true)
  },

  changeKeyword: function (event) {
    this.setData({ keyWord: event.detail.value })
    this.getProductList(true)
  },

  getProductList: async function (is_replace = false) {
    this.setData({ loadding: true })
    const {
      keyWord = '',
      categoryId = '',
      lastSeq,
      product_list,
      award,
      hall = ''
    } = this.data
    const {
      data: { status, result = [], message }
    } = await wx.pro.request({
      url: `${http}/product/listProduct`,
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
      this.setData({
        product_list: is_replace ? result : product_list.concat(result)
      })
      if (result.length) {
        this.setData({ lastSeq: result[result.length - 1].seq })
      }
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
        parentId: '0004'
      }
    })

    if (status === '0000') {
      this.setData({ category_list: result })
    }
  }
})
