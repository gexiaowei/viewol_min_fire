const { globalData, globalData: { http, regeneratorRuntime } } = getApp()

Page({
    data: {
        auth: false,
        code: null,
        ivStr: null,
        nickName: null,
        headPic: null,
        encryptedData: null,
    },

    onLoad: async function() {
        const { authSetting } = await wx.pro.getSetting()
        if (authSetting['scope.userInfo']) {
            this.setData({ auth: true })
            this.login()
        }
    },

    login: async function() {
        try {
            const { userInfo } = await wx.pro.getUserInfo()
            const { code } = await wx.pro.login()
            this.setData({
                code,
                nickName: userInfo['nickName'],
                headPic: userInfo['avatarUrl']
            })
            this.setData({ auth: true })
        } catch (error) {
            wx.showToast({
                icon: 'none',
                title: '获取用户信息失败'
            })
        }
    },

    getPhoneNumber: function({ detail }) {
        const { encryptedData, iv: ivStr } = detail
        this.loginWithPhone({ encryptedData, ivStr })

    },

    loginWithPhone: async function({ encryptedData, ivStr }) {
        let { code, nickName, headPic } = this.data
        const { data: { status, message, result } } = await wx.pro.request({
            url: `${http}/wx/maPhoneLogin`,
            method: 'GET',
            data: {
                code,
                nickName,
                headPic,
                encryptedData,
                ivStr,
                maNum: 3
            }
        })

        if (status === '0000') {
            wx.setStorageSync('uid', result['userId'])
            wx.setStorageSync('sid', result['sessionId'])
            globalData.uid = result.userId
            globalData.sessionId = result.sessionId
            wx.switchTab({ url: "../index/page" })
        } else {
            wx.pro.showToast({
                icon: 'none',
                title: message,
                duration: 1500
            })
        }
    }
})