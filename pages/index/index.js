// index.js
// 获取应用实例
const app = getApp()

// 引入请求模块
import request from '../../utils/request';
Page({
  data: {
    // 轮播图
    bannerList:[],
    // 推荐歌单
    recommendList:[],
    // 排行榜数据
    topList:[],
  },

  async onLoad(options) {
    // 轮播图数据
    let bannerListData = await request('/banner', {type:2});
    this.setData({
      bannerList:bannerListData.banners
    })

    // 推荐歌单数据
    let recommendListData = await request('/personalized', {type:10});
    this.setData({
      recommendList:recommendListData.result
    })

    // 排行榜数据 
    let resArr = [];
    for(var i = 0; i < 3; i++){
      //i 标识idx的值  一共发送多少次请求
      let topListData = await request('/toplist/detail', {idx:i++});
      // console.log(topListData.list[i].name);
      let topListItem = {name:topListData.list[i].name, tracks:topListData.list[i].tracks};
      resArr.push(topListItem);
    }
    // 更新topList
    this.setData({
      topList:resArr
    })
  },
  changphb(){
    wx.navigateTo({
      url: '/pages/phb/phb',
    })
  },
  likeLength(){
    wx.navigateTo({
      url: '/pages/songDatil/songDateil',
    })
  },
  changTuijian(){
    wx.navigateTo({
      url: '/pages/song/song',
    })
  }
})
