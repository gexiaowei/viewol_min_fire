const WxParse = require('../../wxParse/wxParse.js');
const { globalData, globalData: { http, expoId, regeneratorRuntime } } = getApp()

Page({
    data: {
        id: null,
        message: ''
    },
    onLoad: function(option) {
        this.setData({ id: option.id })
        this.getProductInformation()
    },

    getProductInformation: async function() {
        const { id } = this.data
        const { data: { code, collection, comment, company, isPraise, message, praise, result: product, see } } = await wx.pro.request({
            url: `${http}/product/getProduct`,
            method: 'GET',
            data: { id }
        })
        if (code === '0000') {
            this.setData({ code, collection, comment, company, isPraise, praise, product, see })
            WxParse.wxParse('article', 'html', product.contentView, this, 5);
            this.getRelativeProduct(company.id)
        }
    },

    getRelativeProduct: async function(companyId) {
        const { data: { status, message, result } } = await wx.pro.request({
            url: `${http}/product/listProduct`,
            method: 'GET',
            data: {
                expoId,
                companyId,
                num: 3
            }
        })

        if (status === '0000') {
            this.setData({
                relative_products: result
            })
        }
    },

    praiseProduct: async function() {
        const { isPraise, id } = this.data
        if (isPraise !== 0) return

        const { data: { status } } = await wx.pro.request({
            url: `${http}/product/praise`,
            method: 'POST',
            data: {
                productId: id,
                userId: globalData.uid
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' }
        })

        if (status === '0000') {
            wx.showToast({
                title: '点赞成功',
                icon: 'success',
                duration: 3000
            })
            this.getProductInformation()
        }
    },

    commitComment: async function(event) {
        const { id } = this.data
        const { value: content } = event.detail
        const { data: { status } } = await wx.pro.request({
            url: `${http}/product/comment`,
            method: 'POST',
            data: {
                productId: id,
                userId: globalData.uid,
                content
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' }
        })

        if (status === '0000') {
            wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 3000
            })
            this.setData({ message: '' })
            this.getProductInformation()
        }

    }

})