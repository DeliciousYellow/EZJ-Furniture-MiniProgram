// pages/setting/setting.js
import config from '../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    value:"",
    number:"xxx-xxxx-xxxx",
    password:"",
    nickName:"点击登录",
    headPortrait:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    show: false
  },
  
  Loggin(e){
    this.setData({ show: false });
    console.log("到达loggin方法")
    console.log(e)
    wx.login({
      success: (res) => {
        console.log(res)
        if(res.code){
          this.register(res.code,e.detail.userInfo.nickName,e.detail.userInfo.avatarUrl);
        }
      },
    })
    this.setData({ 
      nickName:e.detail.userInfo.nickName,
      headPortrait:e.detail.userInfo.avatarUrl});
  },

  register(code,nickName,avatarUrl){
    // console.log("注册事件")
    // console.log("code=",code)
    // console.log("nickName=",nickName)
    // console.log("avatarUrl=",avatarUrl)
    wx.request({
      url: `${config.baseURL}/Register`,
      method: "POST",
      data: {
        code : code,
        nickName: nickName,
        avatarUrl: avatarUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res =>{
        console.log(res)
        const token = res.data.data.token
        const digestSecret = res.data.data.digestSecret
        const userId = Number.parseInt(res.data.data.userId)
        
        wx.setStorageSync('X-Token', token)
        wx.setStorageSync('DigestSecret', digestSecret)
        wx.setStorageSync('userId', userId)
      }
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的信息'
    })
  },

  GoOrder(e){
    const userId = wx.getStorageSync('userId');
    if(userId == null || userId == ''){
      wx.switchTab({
        url: '/pages/setting/setting',
      })
      wx.showToast({
        title: '请先进行登录',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
      return;
    }
    const index = e.currentTarget.id
    wx.navigateTo({
      url: `/pages/order/order?index=${index}`,
    })
  }
})