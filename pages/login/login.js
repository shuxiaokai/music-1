// pages/login/login.js
import request from '../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    // 表单项内容
    handInput(event) {
        // id传值
        // let type = event.currentTarget.id //取值 phono  || pws

        // 自定义传值
        let type = event.currentTarget.dataset.type;
        // console.log(type, event.detail.value);
        this.setData({
            [type]: event.detail.value
        })
    },

    // 登录
    async login() {
        /**前端验证 */
        // 获取数据
        let { phone, password } = this.data;
        // 验证
        // 手机号验证
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空',
                // 不显示图标
                icon: 'none'
            });
            return;
        }
        // 正则表达式 验证手机号
        let phonoReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (!phonoReg.test(phone)) {
            wx.showToast({
                title: '手机号不不正确',
                // 不显示图标
                icon: 'none'
            });
            return;
        }

        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                // 不显示图标
                icon: 'none'
            });
            return;
        }

        /**后端验证 */
        let result = await request('/login/cellphone', { phone, password, isLogin:true});
        // 喜欢的音乐用户id
        let user = await  request('/playlist/detail', {id:6764404655});
        // console.log(user);
        if (result.code == 200) {
            wx.switchTab({
                title: '登录成功',
                 // 跳转到个人中心
                url:"/pages/profile/profile"
            });
            // 将用户信息保存到本地
            wx.setStorageSync('userInfo', JSON.stringify(result.profile));

            // 将用户喜欢的音乐Id保存到本地
            wx.setStorageSync('userId', JSON.stringify(user.playlist.id));

        } else if (result.code == 400) {
            wx.showToast({
                title: '手机号错误',
                icon: 'none'
            });
        } else if (result.code == 502) {
            wx.showToast({
                title: '密码错误',
                icon: 'none'
            });
        } else {
            wx.showToast({
                title: '登录失败，重新登录',
                icon: 'none'
            });
        }
    },

})