const app = getApp()
const {
  globalData,
  globalData: { http, regeneratorRuntime }
} = getApp()

const pageOptions = {
  data: {
    inviteeNums: 0
  },
  onShow: function (options) {
    if (globalData.uid) {
      this.getBasicInfo()
      this.getInviteeNum()
    } else {
      wx.redirectTo({
        url: '../login/page'
      })
    }
  },
  getBasicInfo: async function () {
    const {
      data: { status, result, message }
    } = await wx.pro.request({
      url: `${http}/fuser/getFuser`,
      method: 'GET',
      data: { userId: globalData.uid }
    })
    console.log(result)
    if (status === '0000') {
      this.setData(result)
    }
  },
  getInviteeNum: async function () {
    const {
      data: { status, num, message }
    } = await wx.pro.request({
      url: `${http}/fuser/inviteeNum`,
      method: 'GET',
      data: { userId: globalData.uid }
    })
    if (status === '0000') {
      this.setData({ inviteeNum: num })
    }
  },
  getPostImage: async function () {
    const {
      data: { status, url, message }
    } = await wx.pro.request({
      url: `${http}/fuser/genPlaybill`,
      method: 'GET',
      data: { userId: globalData.uid }
    })
    if (status === '0000') {
      this.setData({ postImage: url })
    }
  },
  toTickPage: function () {
    wx.navigateTo({
      url:
        '../web/page?url=' +
        encodeURIComponent(globalData.sign_up_url) +
        '&title=报名'
    })
  },
  savePostImage: async function () {
    try {
      wx.showLoading({
        title: '加载中...'
      })

      const { authSetting } = await wx.pro.getSetting()

      console.log(authSetting)
      if (!authSetting['scope.writePhotosAlbum']) {
        await wx.pro.authorize({ scope: 'scope.writePhotosAlbum' })
      }
      await this.getPostImage()
      console.log(this.data.postImage)
      const data = await wx.pro.downloadFile({
        url: this.data.postImage,
        type: 'image'
      })

      await wx.pro.saveImageToPhotosAlbum(data.tempFilePath)
      wx.hideLoading()
      wx.showToast({
        title: '已经为您保存邀请海报，您可以将海报分享至朋友圈',
        duration: 3000,
        icon: 'success'
      })
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '保存图片失败',
        icon: 'none',
        duration: 3000
      })
    } finally {
    }
  },

  onShareAppMessage () {
    const title = '中国国际消防设备技术交流展览会'
    const path = `pages/index/page?scene=14:${globalData.uid}`
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl
    }
  }
}

Page(pageOptions)
