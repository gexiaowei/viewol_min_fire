const { globalData, globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        url: null,
        title: null,
        sence: null
    },

    onLoad: async function({ url, title, sence }) {
        console.log("TCL: sence", sence)
        if (title) {
            const decode_title = decodeURIComponent(title);
            console.log("TCL: decode_title", decode_title)
            wx.setNavigationBarTitle({ title: decode_title })
            this.setData({ title: decode_title })
        }
        const decode_url = decodeURIComponent(url)
        console.log("TCL: decode_url", decode_url)
        this.setData({ url: decode_url })
        if (sence) {
            const decode_sence = decodeURIComponent(sence)
            console.log("TCL: decode_sence", decode_sence)
            this.setData({ sence: decode_sence })
            wx.showShareMenu()
        }

    },

    onShareAppMessage: function(res) {
        return {
            title: this.data.title,
            path: `pages/index/page?scene=${this.data.sence}`,
            success: (shareTickets) => {
                console.info(shareTickets + '成功');
            },
            fail: function(res) {
                console.log(res + '失败');
                // 转发失败
            }
        }
    }
})