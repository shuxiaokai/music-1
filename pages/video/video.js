import request from '../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 导航标间数据
        videoGroupList:[],
        navId:'',//导航的标识
        videoList:[],//视频数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 导航数据
        this.getvideoGroupListData();
        
    },

   async getvideoGroupListData(){
        let videoGroupListData = await request('/video/group/list');
        this.setData({
            videoGroupList:videoGroupListData.data.splice(0, 14),
            navId:videoGroupListData.data[0].id
            // navId:58100
        })
        // 视频数据
        this.getvideo(this.data.navId);
    },
    // 点击切换导航
    changNav(event){
        let navId = parseInt(event.currentTarget.id); // id为string类型   需要转换为number
        this.setData({
            navId
        })
        this.getvideo(this.data.navId);
    },

    // 获取视频的数据
    async getvideo(navId){
        let viodeListData = await request('/video/timeline/recommend');
        // console.log(viodeListData);
        let index = 0;
        let videoList = viodeListData.datas.map( item =>{
            item.id = index++;
            return item;
        })
        this.setData({
            videoList
        })
    },
    changInput(){
        wx.navigateTo({
            url: '/pages/search/search',
          })
    }
})