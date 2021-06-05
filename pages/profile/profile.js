// pages/profile/profile.js
import request from '../../utils/request';
import PubSub from 'pubsub-js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息
        userInfo: {},
        // 最近播放
        recenProfile: [],
        //喜欢音乐的个数
        likeLength:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取用户的信息  字段要与login的保持一致
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            // 更新userInfo
            this.setData({
                userInfo: JSON.parse(userInfo)
            })

            // 获取用户播放记录
            this.getrecenProfile(this.data.userInfo.userId)
        }

        // 喜欢音乐的长度
        PubSub.subscribe('likeLength', (msg, likeLength) =>{
            this.setData({
                likeLength
            })
        })
    },
    // 获取用户播放记录功能
    async getrecenProfile(userId) {
        let index = 0;
        let recenProfileData = await request('/user/record', { uid: userId, type: 0 });
        let recenProfile = recenProfileData.allData.splice(0, 10).map(item =>{
            item.id = index++;
            return item;
        })
        this.setData({
            recenProfile
        })
    },

    // 跳转登录 回调
    toLogin() {
        wx.reLaunch({
            url: '/pages/login/login'
        })
    },
    changLike(){
        wx.navigateTo({
            url: '/pages/like/like'
        })
    }
})