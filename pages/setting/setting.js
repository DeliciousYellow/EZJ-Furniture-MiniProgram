// pages/setting/setting.js
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
      url: 'http://127.0.0.1:8080/Register',
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
        const token = res.data.data.token;
        const userId = Number.parseInt(res.data.data.userId)
        wx.setStorageSync('X-Token', token);
        wx.setStorageSync('userId', userId);
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
  }
})