import util from '../../utils/util.js'

const app = getApp()
const {
  globalData,
  globalData: { http, expoId, regeneratorRuntime }
} = app

Page({
  data: {
    scene: null,
    recomment_company_list: [],
    recomment_product_list: [],
    recommend_schedule_list: [],
    height_product_swiper: null,
    web_url: encodeURIComponent(globalData.video_url),
    video: {
      source: 'http://www.view-ol.com/1.mp4',
      link: 'https://www.baidu.com',
      title: '消防展'
    }
  },

  onLoad: function ({ scene = '' }) {
    if (scene) this.setData({ scene })
    const userId = wx.getStorageSync('uid')
    if (userId && userId > 0) {
      globalData.uid = userId
    }
    this.getRecommentCompanyList()
    this.getProductCompanyList()
    this.getNowRecommendSchedule()
  },

  onShow: function () {
    const { scene } = this.data
    // 消费掉首次报名跳转
    if (scene) {
      console.log('处理scene')
      console.log(scene)
      const [type, id] = decodeURIComponent(scene).split(':')
      switch (type) {
        case '11':
          this.getCompanyInfo(id)
          break
        case '12':
          wx.navigateTo({
            url: '../activity/detail?id=' + id
          })
          break
        case '13':
          wx.navigateTo({
            url:
              '../web/page?url=' +
              encodeURIComponent(globalData.sign_up_url) +
              '&title=报名'
          })
          globalData.userJoin = 1
          break
        case '14':
          globalData.invitee = id
          wx.navigateTo({
            url:
              '../web/page?url=' +
              encodeURIComponent(globalData.sign_up_url) +
              '&title=报名'
          })
          break
        default:
          break
      }
      this.setData({ scene: null })
    }

    // 消费掉首次报名跳转
    if (!globalData.userJoin) {
      wx.navigateTo({
        url:
          '../web/page?url=' +
          encodeURIComponent(globalData.sign_up_url) +
          '&title=报名'
      })
      globalData.userJoin = 1
    }
  },

  goExhibitors: function (event) {
    globalData.firefighting_exhibitors_award = event.currentTarget.dataset.award
    wx.switchTab({
      url: '../exhibitors/page'
    })
  },

  showImage: function (event) {
    const url = event.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
  },

  getCompanyInfo: async function (id) {
    const {
      data: {
        code,
        showInfo,
        result: { name }
      }
    } = await wx.pro.request({
      url: `${http}/company/getCompany`,
      method: 'GET',
      data: {
        id,
        userId: globalData.uid
      }
    })
    if (code === '0000') {
      let link
      if (showInfo) {
        link = encodeURIComponent(
          `https://www.view-ol.com/zsx/?t=${Date.now()}#/?company_id=${id}&user_id=${
            globalData.uid
          }&expo_id=${globalData.expoId}`
        )
      } else {
        link = encodeURIComponent(
          `https://www.view-ol.com/zsx/?t=${Date.now()}#/detail?company_id=${id}&user_id=${
            globalData.uid
          }&expo_id=${globalData.expoId}`
        )
      }

      wx.navigateTo({
        url:
          '../web/page?url=' +
          link +
          '&title=' +
          encodeURIComponent(name) +
          '&sence=' +
          encodeURIComponent(`11:${id}`)
      })
    }
  },

  getRecommentCompanyList: async function () {
    const {
      data: { status, result = [] }
    } = await wx.pro.request({
      url: `${http}/company/recommentCompanyList`,
      method: 'GET',
      data: {
        expoId
      }
    })
    if (status === '0000') {
      result.forEach(element => {
        if (element.showInfo) {
          element.link = encodeURIComponent(
            `https://www.view-ol.com/zsx/?t=${Date.now()}#/?company_id=${
              element.id
            }&user_id=${globalData.uid}&expo_id=${globalData.expoId}`
          )
        } else {
          element.link = encodeURIComponent(
            `https://www.view-ol.com/zsx/?t=${Date.now()}#/detail?company_id=${
              element.id
            }&user_id=${globalData.uid}&expo_id=${globalData.expoId}`
          )
        }

        element.sence = encodeURIComponent(`11:${element.id}`)
      })
      const tmp = util.chunk(result, 4)
      const data = []
      for (let i = 0; i < tmp.length / 2; i++) {
        data.push([tmp[i * 2], tmp[i * 2 + 1] || tmp[0]])
      }
      this.setData({
        recomment_company_list: data
      })
    }
  },

  getProductCompanyList: async function () {
    const {
      data: { status, result = [], message }
    } = await wx.pro.request({
      url: `${http}/product/recommentProductList`,
      method: 'GET',
      data: {
        expoId
      }
    })
    if (status === '0000') {
      let tmp = util.chunk(result, 4)
      let data = []
      for (let i = 0; i < tmp.length / 2; i++) {
        data.push([tmp[i * 2], tmp[i * 2 + 1] || tmp[0]])
      }

      this.setData({
        recomment_product_list: data
      })
    }
  },

  getNowRecommendSchedule: async function () {
    const {
      data: { status, result = [], message }
    } = await wx.pro.request({
      url: `${http}/schedule/queryNowRecommendSchedule`,
      method: 'GET',
      data: {
        expoId,
        type: 2
      }
    })
    this.setData({
      recommend_schedule_list: result
    })
  },

  showWarning: function () {
    wx.pro.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 1500
    })
  }
})
