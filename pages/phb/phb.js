// pages/phb/phb.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 推荐榜
        topdetailList:[],
        // 官方榜
        topdetailgaun:[],
        // 精选榜
        topdetailjxuan:[],
        // 曲风榜
        topdetailqufeng:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTopList();
    },
    async getTopList(){
        let topListData = await request('/toplist/detail');
        this.setData({
            topdetailgaun:topListData.list.splice(0, 4),
            topdetailList:topListData.list.splice(0, 3),
            topdetailjxuan:topListData.list.splice(0, 4),
            topdetailqufeng:topListData.list.splice(13, 8),
            
        })
    }

})