const app = getApp()
const {
  globalData,
  globalData: { http, regeneratorRuntime }
} = getApp()

const pageOptions = {
  data: {},
  onShow: async function (options) {
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
  onShareAppMessage () {
    /* const title = ''
    const path = ''
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl,
    } */
  }
}

Page(pageOptions)
