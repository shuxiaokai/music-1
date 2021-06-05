// pages/like/like.js
import request from '../../utils/request'
import PubSub from 'pubsub-js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 喜欢歌曲
        likeList:[],
        // 用户信息
        userInfo:{},
        // 喜欢的列表
        likeListes:{},
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo');
        if(!userInfo){
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                success: (result) => {
                    // 跳转登录页面
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                }
            });
        }
        this.setData({
            userInfo: JSON.parse(userInfo)
        })


        this.getRecommend(this.data.usersId);
        // 音乐播放切换
        PubSub.subscribe('switchType', (mas, type) =>{
            console.log(type);
            let {likeListes, index} = this.data;
            if(type == 'pre'){
                // 上一首
                (index === 0) && (index = likeListes.trackIds.length)
                index -= 1
            }else{
                // console.log('next');
                // 下一首
                (index === likeListes.trackIds.length - 1) && (index = -1)
                index += 1;
            }
            this.setData({
                index
            })
            let musicId = likeListes.trackIds[index].id;
            PubSub.publish('musicId',musicId)
        })
        
        
    },

    async getRecommend(){
        // 6764404655
        // 从本地中获取到usersID
        let usersId = wx.getStorageSync('userId');
        let recommend = await  request('/playlist/detail', {id:usersId});
        this.setData({
            likeListes:recommend.playlist,
        })
        // 发送到个人中心
        // 发送到个人中心
        PubSub.publish('likeLength',recommend.playlist.tracks.length)
    },
    // 播放音乐
    changLike(e){
        let likeId = e.currentTarget.dataset.likeid;
        wx.navigateTo({
            url: '/pages/songDatil/songDateil?muiscId=' + likeId,
        })
    }
})