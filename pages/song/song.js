import request from '../../utils/request';
import PubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',//日
        month: '',//月
        // 每日推荐
        songList: [],
        // 标识点击音乐的下标
        index:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 更新日期
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
        })

        // 判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo');
        if (!userInfo) {
            wx.showToast({
                title: "请先登录",
                icon: 'none',
                success: () => {
                    // 跳转登录页面
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                }
            })
        }

        this.getsongListData();

        // 获取songDateil页面发布出来的数据
        // PubSub.subscribe('自定义事件', 回调函数)
        PubSub.subscribe('switchType', (msg, type)=>{
            let {songList, index} = this.data;
            // console.log(songList.length);
             if(type == 'pre'){//上一首
                // 第一首切换上一首
                (index === 0) && (index = songList.length)
                // index--
                index -= 1
             }else{//下一首
                 // 最后一首切换下一首
                  (index === songList.length - 1) && (index = -1)
                // index++
                index += 1
             }
            //  更新下标index  不然index不会变
            this.setData({
                index
            })
            //  将id 回调到songDateil页面
             let musicId = songList[index].id;
             // 提交数据给song页面
             PubSub.publish('musicId', musicId);
        })

    },

    async getsongListData() {
        // 获取每日推荐数据
        let songListData = await request('/recommend/songs');
        this.setData({
            songList: songListData.data.dailySongs.splice(0, 25)
        })
    },

    // 跳转播放页面
    toSongDateil(event){
        let {song, index} = event.currentTarget.dataset;
        this.setData({
            index
        })
        // 路由跳转传参  query参数
        // 不能将song对象 直接作为参数传递过去， 长度过长 会被截取掉  不能使用JSON.stringify()方法
        wx.navigateTo({
            // url: '/pages/songDatil/songDateil?song=' + JSON.stringify(song),
            url: '/pages/songDatil/songDateil?muiscId=' + song.id,
        });

    }
})