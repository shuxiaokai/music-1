// pages/pinlun/pinlun.js
import request from '../../utils/request';
// 时间处理包
import PubSub from 'pubsub-js';
import moment from 'moment';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topList:['推荐', '最热', '最新'],
        navId:0,
        // 评论的数据
        commentList:[],
        day: [],
        songList:[],
        musicId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            musicId:options.id
        })
        this.getcommentList(options.id);
    },
    async getcommentList(musicId){
        let commentListData = await request('/comment/music', {id:musicId});
        // 时间处理
        for(var i = 0; i < commentListData.comments.length; i++){
            // var date = new Date(commentListData.comments[i].time);
        //     this.data.day.push(date.getFullYear() )
        //     // console.log(); +  date.getMonth() + 1 + date.getDay()
        //     // console.log(date.getMonth() + 1);
        //     // console.log(date.getDay());
        // let date = moment(commentListData.comments.time).format('YYYY MMMM Do');
        // console.log(date);
        }
        
        this.setData({
            commentList:commentListData
        })
    },
    // 切换导航
    changTop(e){
        // console.log(e.currentTarget.dataset.index);
        let navId = e.currentTarget.dataset.index;
        this.setData({
            navId
        });

        this.getcommentList(this.data.musicId)
    },
    
})