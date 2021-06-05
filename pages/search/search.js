import request from '../../utils/request';
// 节流 
let isSend = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placSearch: '',//默认值
        hostListL: [],//热搜榜
        searchData: '',//搜索的数据
        searchList: [],//用户搜索
        histortList: [],//历史
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInitData();
        // 历史记录
        this.getsearchHistort();
        // this.getmusicList();
    },
    // 初始化的数据
    async getInitData() {
        // 搜索
        let placSearchData = await request('/search/default');
        // 热搜榜
        let hostListLData = await request('/search/hot/detail');
        // console.log(placSearchData);
        this.setData({
            placSearch: placSearchData.data.showKeyword,
            hostListL: hostListLData.data
        })
    },
    // 获取本地历史记录
    getsearchHistort(){
        let histortList = wx.setStorageSync('searchHistort');
        if(histortList){
            this.setData({
                histortList
            })
        }
    },
    // 搜索数据的回调
    changInput(event) {
        let searchData = event.detail.value;
        this.setData({
            searchData
        })
        // 函数节流 isSend
        if (isSend) {
            return;
        }
        isSend = true;
        this.getSearchList();
        setTimeout(() => {
            isSend = false;
        }, 3000)
    },
    // 匹配搜索
    async getSearchList() {
        if (!this.data.searchData) {
            this.setData({ [searchList]: [] })
            return;
        }
        let { searchData, histortList } = this.data;
        let searchListData = await request('/search', { keywords: this.data.searchData, limit: 10 });
        this.setData({
            searchList: searchListData.result.songs
        })
        // 将历史记录保存到数组
        histortList.unshift(searchData);
        this.setData({
            histortList
        })
        wx.setStorageSync('searchHistort', histortList);
    },
    // changIndex(e){
    //     console.log(e);
    // },
    // 取消退出搜索
    changQuxiao() {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    }

})