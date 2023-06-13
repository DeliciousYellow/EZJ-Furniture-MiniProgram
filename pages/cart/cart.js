// pages/cart/cart.js
import config from '../../config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartData:[],
    hasData:false,
    value:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })

    // wx.request({
    //   url: `${config.baseURL}/`,
    // })

  },

  onChange(event) {
    console.log(event.detail);
  },

  GoHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})