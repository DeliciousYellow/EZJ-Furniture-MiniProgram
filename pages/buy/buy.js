// pages/buy/buy.js
import config from '../../config.js'
import { SHA256 } from 'crypto-js'
import moment from 'moment';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    order:[],
    orderComment:'',
    sum:0,
    money:null,
    checkedAddress:{}
  },

  onShow(){
    const address = wx.getStorageSync('checkedAddress')
    console.log(address)
    this.setData({
      checkedAddress: address
    })
  },

  onLoad(options) {
    console.log(JSON.parse(options.order))
    this.setData({
      order:JSON.parse(options.order),
    })
    let money = 0
    this.data.order.forEach((item) => {
      money += item.Furniture.furniturePrice*item.Cart.cartCount
    })
    this.setData({
      money: money,
      sum: money*100
    })
  },

  GoAddress(){
    const token = wx.getStorageSync('X-Token')
    console.log(token)
    const JwtRule = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    if (JwtRule.test(token)) {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }else {
      wx.switchTab({
        url: '/pages/setting/setting',
      })
      wx.showToast({
        title: '请先进行登录',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
    }
  },

  onChange(e){
    console.log(e.detail)
    this.setData({
      orderComment:e.detail
    })
  },

  onClickButton(){
    console.log(this.data.orderComment)
    console.log("提交订单")
    if (this.data.order.length == 0) {
      console.log("订单为空")
      return
    }
    //生成一个UUID用作订单编号，同一次提交的订单，订单编号一致
    const uuid = this.GetUUID()
    //获取系统当前时间
    var currentTime = moment();
    // 格式化当前时间为 "yyyy-MM-dd HH:mm:ss"
    var formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss');
    // console.log(currentTime)
    console.log(formattedTime)
    const userId = Number.parseInt(wx.getStorageSync('userId'))
    const token = wx.getStorageSync('X-Token')
    const digestSecret = wx.getStorageSync('DigestSecret')

    this.data.order.forEach((item) => {
      const requestData = JSON.stringify({
        orderCode: uuid,
        creatTime: formattedTime,
        orderState: "待发货",
        userId: userId,
        furnitureId: item.Furniture.furnitureId,
        addressId: this.data.checkedAddress.addressId,
        orderCount: item.Cart.cartCount,
        orderComment: this.data.orderComment
      })
      wx.request({
        url: `${config.baseURL}/AddOrderByUserId`,
        method:'POST',
        header:{
          'X-Token':token,
          'X-Digest':SHA256(requestData+digestSecret).toString().toUpperCase()
        },
        data:requestData,
        success: (res) => {
          console.log(res)
        }
      })
    })
    wx.switchTab({
      url: '/pages/setting/setting',
    })
    wx.showToast({
      title: '提交订单成功',
      icon: 'success', // 提示图标，可选值：'success'、'loading'、'none'
      duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
      mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
    })
  },

  GetUUID() {
    var chars = '0123456789abcdef';
    var uuid = '';
    for (var i = 0; i < 32; i++) {
      var index = Math.floor(Math.random() * 16);
      uuid += chars.charAt(index);
    }
    return uuid;
  }
})