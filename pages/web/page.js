const { globalData, globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        url: null,
        title: null
    },

    onLoad: async function({ url, title }) {
        console.log(title)
        if (title) {
            const decode_title = decodeURIComponent(title);
            wx.setNavigationBarTitle({ title: decode_title })
            this.setData({ title: decode_title })
        }
        const decode_url = decodeURIComponent(url)
        console.log("TCL: decode_url", decode_url)
        this.setData({ url: decode_url })
        wx.showShareMenu()
    },

    onShareAppMessage: function(res) {
        return {
            title: this.data.title
        }
    }
})