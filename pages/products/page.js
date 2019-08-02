const { globalData: { http, regeneratorRuntime, expoId } } = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        award: null,
        product_list: [],
        category_list: [],
        lastSeq: '',
        keyWord: '',
        loadding: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function({ award }) {
        if (award) this.setData({ award })
        this.getCategoryList()
        this.getProductList()
    },


    onReachBottom: function() {
        this.getProductList()
    },

    changeCategory: function(event) {
        const id = event.detail.value
        this.setData({ categoryId: id })
        this.getProductList(true)
    },

    changeKeyword: function(event) {
        this.setData({ keyWord: event.detail.value })
        this.getProductList(true)
    },

    getProductList: async function(is_replace = false) {
        this.setData({ loadding: true })
        const { keyWord = '', categoryId = '', lastSeq, product_list, award } = this.data
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/product/listProduct`,
            method: 'GET',
            data: {
                expoId,
                award,
                keyWord,
                categoryId,
                lastSeq: is_replace ? '' : lastSeq,
                num: 20
            }
        })

        if (status === '0000') {
            this.setData({ product_list: is_replace ? result : product_list.concat(result) })
            if (result.length) this.setData({ lastSeq: result[result.length - 1]['seq'] })
        }

        this.setData({ loadding: false })
    },

    getCategoryList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
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