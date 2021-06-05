
import config from './config'

export default (url, data = {}, method = "GEt") => {
    let cookieQingqiu = wx.getStorageSync('cookies')
    let cookie = cookieQingqiu ? cookieQingqiu.find(item =>item.indexOf('MUSIC_U') !== -1) : ''
    return new Promise((resolve, reject) => {
        wx.request({
            // http://127.0.0.1:3000/banner
            url:config.host + url   ,
            data,
            method, // 请求方式
            header:{
                // 从本地中读取数据
                // cookie:wx.getStorageSync('cookies')[3] //由于请求时 cookies不一  不能使用下标来检索
                cookie
            },
            // 成功
            success: (result) => {
                // console.log(result);
                if(data.isLogin){//登录请求
                    // 将用户cookits保存到本地
                    wx.setStorage({
                        key: 'cookies',
                        data: result.cookies
                    });
                }
                resolve(result.data);
            },
            // 失败
            fail: (err) => {
                reject(err)
            },
        });
    })
}