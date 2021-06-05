// app.js
// App 注册整个小程序
import request from './utils/request';
App({
    globalData:{
        // 标识播正在放的音乐
        isMusicPlay:false,
        // 播放音乐的id
        musicId:'',
        songList:[]
    },
})
