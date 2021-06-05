import request from '../../utils/request';
// 歌曲切换包
import PubSub from 'pubsub-js';
// 播放时间处理包
import moment from 'moment';
// 获取全局实例
const gloalApp = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,//播放或暂停
        // 歌曲详情
        song: {},
        muiscId: '',//音乐id
        musicLink: '',//音乐链接
        beginTime: '00:00',//总时长
        endTime: '00:00',//实时时间
        beginWidth:''//实时进度条的宽度

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 提交数据给评论页面
        PubSub.publish('commentMusicId',this.data.song.al);
        // options 接收路由跳转的query参数
        // console.log(options);
        // 点击音乐后  进来播放音乐
        // this.musicConter(true,options.muiscId);
        this.getmusic(options.muiscId);
        let muiscId = options.muiscId;
        
        this.setData({
            muiscId
        })
        // 音乐详情
        this.getMusicInfo(muiscId);

        // 判断音乐是否在播放
        if (gloalApp.globalData.isMusicPlay && gloalApp.globalData.muiscId === muiscId) {
            // 修改当前页的播放状态为true
            this.setData({
                isPlay: true
            })
        }
        /**
         * 用户操作系统 和 小程序 的播放 暂停 不一致
         * 系统设置
         * */
        // 监听 播放和 暂定
        // 创建控制音乐播放实例
        // 将backAudioManager用this保存到全局对象 
        this.backAudioManager = wx.getBackgroundAudioManager();
        this.backAudioManager.onPlay(() => {
            this.changgetPlay(true);
            // 修改全局的变量播放状态  
            gloalApp.globalData.muiscId = muiscId;
        });
        this.backAudioManager.onPause(() => {
            this.changgetPlay(false);

            // 修改全局的变量播放状态  再次修改播放时 不用带id  
            // gloalApp.globalData.isMusicPlay = false;
        });
        this.backAudioManager.onStop(() => {
            this.changgetPlay(false);
            // 修改全局的变量播放状态
            // gloalApp.globalData.isMusicPlay = false;
        });

        // 监听音乐的实时进度时间
        this.backAudioManager.onTimeUpdate(() => {
            // moment() 只接受ms 所以需要转换为ms
            // this.backAudioManager.currentTime 单位为秒
            var Tiem = this.backAudioManager.currentTime;
            let beginTime = moment(Tiem * 1000).format('mm:ss');
            // 总时时 / 实时的时长 * 进度条宽度
            let beginWidth = Tiem / this.backAudioManager.duration * 450;
            this.setData({
                beginTime,
                beginWidth
            })
        });
    },
    // 点击进来 开始播放音乐
    async getmusic(muiscId) {
        // this.getmuiscbofang(muiscId);
        // return;
    },
    // 封装修改播放 和暂停的 功能函数
    changgetPlay(isPlay) {
        // 修改播放状态
        this.setData({
            isPlay
        })

        // 修改全局的变量播放状态
        gloalApp.globalData.isMusicPlay = isPlay;
    },

    //  播放或暂停
    musicPlay() {
        // 是否播放的状态
        let isPlay = !this.data.isPlay;
        // this.setData({
        //     isPlay
        // })
        let { muiscId, musicLink } = this.data;
        this.musicConter(isPlay, muiscId, musicLink);
    },

    // 控制音乐 播放和 暂定
    async musicConter(isPlay, muiscId, musicLink) {
        if (isPlay) {
            //播放
            // 避免多次求请求同样的数据
            // if (!musicLink) {
                // 获取音乐的播放连接
                let musicLinkData = await request('/song/url', { id: muiscId });
                let musicLink = musicLinkData.data[0].url;
                this.setData({
                    musicLink
                })
            // } 
            // else {
                // backAudioManager.src = '音频连接'
                this.backAudioManager.src = musicLink;
                this.backAudioManager.title = this.data.song.name;
            // }

            // this.getmuiscbofang(muiscId)
        } else {
            //暂停
            this.backAudioManager.pause();
        }
    },

    // 获取音乐详情
    async getMusicInfo(muiscId) {
        let songData = await request('/song/detail', { ids: muiscId });
        // 时间格式化
        let endTime = moment(songData.songs[0].dt).format('mm:ss');
        this.setData({
            song: songData.songs[0],
            endTime
        })
        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        });
    },

    // 点击切换歌曲
    headerSwitch(event) {
        // 获取切换歌曲的类型
        let type = event.currentTarget.id;
        // 切换歌曲 关闭当前歌曲
        this.backAudioManager.stop();
        // 接收song页面发送过来的数据
        PubSub.subscribe('musicId', (msg, musicId) => {
            // 获取音乐的详情
            this.getMusicInfo(musicId);
            // 自动播放音乐
            this.musicConter(true, musicId);
            // 取消接收 会累加接收数据  操作完需要取消
            PubSub.unsubscribe('musicId');
        })
        // 提交数据给like页面
        PubSub.publish('switchType', type);
    },

    // 播放音乐的公共函数
    async getmuiscbofang(muiscId) {
        // 获取音乐的播放连接
        let musicLinkData = await request('/song/url', { id: muiscId });
        let musicLink = musicLinkData.data[0].url;
        // console.log( musicLinkData.data[0].url);
        // backAudioManager.src = '音频连接'
        this.backAudioManager.src = musicLink;
        this.backAudioManager.title = this.data.song.name;
    },
    changpinglun(){
        wx.navigateTo({
            url: '/pages/pinlun/pinlun?id=' + this.data.muiscId,
          })
    }
})