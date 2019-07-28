Page({
    data: {
        url: null
    },

    onLoad: function({ url, title }) {
        console.log("TCL: url", decodeURIComponent(url))
        if (title) wx.setNavigationBarTitle({ title })
        this.setData({ url: decodeURIComponent(url) })
    }
})