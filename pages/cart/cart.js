// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
  },

  GoHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})