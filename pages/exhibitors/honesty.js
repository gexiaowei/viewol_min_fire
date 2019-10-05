const { globalData, globalData: { http, expoId, regeneratorRuntime } } = getApp()

Page({

    data: {
        award: 1,
        category_list: [],
        company_list: [],
        lastSeq: '',
        keyWord: '',
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

    changeCategory: function (event) {
        const id = event.detail.value
        this.setData({ categoryId: this.data.category_list[id]["id"] })
        this.getCompanyList(true)
    },

    changeKeyword: function (event) {
        this.setData({ keyWord: event.detail.value })
        this.getCompanyList(true)
    },

    getCompanyList: async function (is_replace = false) {
        this.setData({ loadding: true })
        const { keyWord = '', categoryId = '', lastSeq, company_list, award } = this.data
        let { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/company/listCompany`,
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
            result.forEach(element => {
                if (element.showInfo) element.link = encodeURIComponent(`https://www.view-ol.com/zsx/#/?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)
                else element.link = encodeURIComponent(`https://www.view-ol.com/zsx/#/detail?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)
                element.sence = encodeURIComponent(`11:${element.id}`)
            });
            this.setData({ company_list: is_replace ? result : company_list.concat(result) })
            if (result.length) this.setData({ lastSeq: result[result.length - 1]['seq'] })
        }

        this.setData({ loadding: false })
    },

    getCategoryList: async function () {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/category/listCategory`,
            method: 'GET',
            data: {
                parentId: '0005'
            }
        })

        if (status === '0000') {
            this.setData({ category_list: result })
        }
    }

})