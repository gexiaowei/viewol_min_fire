import util from '../../utils/util.js'

const app = getApp()
const { globalData, globalData: { http, expoId, regeneratorRuntime } } = app

Page({
    data: {
        scene: null,
        recomment_company_list: [],
        recomment_product_list: [],
        recommend_schedule_list: [],
        height_product_swiper: null,
        video: {
            source: 'http://www.view-ol.com/1.mp4',
            link: 'https://www.baidu.com',
            title: '百度'
        }
    },

    onLoad: function({ scene = '' }) {
        if (scene) this.setData({ scene })
        const user_id = wx.getStorageSync('uid')
        if (!user_id && !globalData.uid) {
            wx.navigateTo({
                url: '../login/page?scene=' + encodeURIComponent(scene)
            })
        } else {
            const session_id = wx.getStorageSync('sid')
            globalData.uid = user_id
            globalData.sid = session_id
        }
        this.getRecommentCompanyList()
        this.getProductCompanyList()
        this.getNowRecommendSchedule()
    },

    onShow: function() {
        const { scene } = this.data
            //消费掉首次报名跳转
        if (globalData.uid) {
            if (scene) {
                console.log('处理scene')
                const [type, id] = decodeURIComponent(scene).split(':')
                switch (type) {
                    case '11':
                        this.getCompanyInfo(id)
                        break;
                    case '12':
                        wx.navigateTo({
                            url: '../activity/detail?id=' + id
                        })
                        break;
                    case '13':
                        wx.navigateTo({
                            url: '../web/page?url=' + encodeURIComponent(globalData.sign_up_url) + '&title=报名'
                        })
                        globalData.userJoin = 1
                        break;
                    default:
                        break;
                }
                this.setData({ scene: null })
            }

            //消费掉首次报名跳转
            if (!globalData.userJoin) {
                wx.navigateTo({
                    url: '../web/page?url=' + encodeURIComponent(globalData.sign_up_url) + '&title=报名'
                })
                globalData.userJoin = 1
            }
        }

    },

    goExhibitors: function(event) {
        globalData.firefighting_exhibitors_award = event.currentTarget.dataset.award
        wx.switchTab({
            url: '../exhibitors/page',
        })
    },

    getCompanyInfo: async function(id) {
        const { data: { code, showInfo, result: { name } } } = await wx.pro.request({
            url: `${http}/company/getCompany`,
            method: 'GET',
            data: {
                id,
                userId: globalData.uid
            }
        })
        if (code === '0000') {
            let link
            if (showInfo) link = encodeURIComponent(`https://www.view-ol.com/zsx/#/?company_id=${id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)
            else link = encodeURIComponent(`https://www.view-ol.com/zsx/#/detail?company_id=${id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)

            wx.navigateTo({
                url: '../web/page?url=' + link + '&title=' + encodeURIComponent(name) + '&sence=' + encodeURIComponent(`11:${id}`)
            })
        }
    },

    getRecommentCompanyList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/company/recommentCompanyList`,
            method: 'GET',
            data: {
                expoId
            }
        })
        if (status === '0000') {
            result.forEach(element => {

                if (element.showInfo) element.link = encodeURIComponent(`https://www.view-ol.com/zsx/#/?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)
                else element.link = encodeURIComponent(`https://www.view-ol.com/zsx/#/detail?company_id=${element.id}&user_id=${globalData.uid}&expo_id=${globalData.expoId}`)

                element.sence = encodeURIComponent(`11:${element.id}`)
            })
            let tmp = util.chunk(result, 4)
            let data = []
            for (let i = 0; i < tmp.length / 2; i++) {
                data.push([tmp[i * 2], tmp[i * 2 + 1] || tmp[0]])
            }
            this.setData({
                recomment_company_list: data
            })
        }
    },

    getProductCompanyList: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
            url: `${http}/product/recommentProductList`,
            method: 'GET',
            data: {
                expoId
            }
        })
        if (status === '0000') {
            this.setData({
                recomment_product_list: util.chunk(result, 3)
            })
        }
    },

    getNowRecommendSchedule: async function() {
        const { data: { status, result = [], message } } = await wx.pro.request({
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

    showWarning: function() {
        wx.pro.showToast({
            title: '敬请期待',
            icon: 'none',
            duration: 1500
        });

    }
})