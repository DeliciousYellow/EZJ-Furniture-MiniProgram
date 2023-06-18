// pages/detail/detail.js0
import config from '../../config.js'
import { SHA256 } from 'crypto-js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrImg:[],
    furnitureData:[],
    show:false,
    activeNames: ['1'],
    addressRegion:'尚未登录',
    infoNumber:null
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("详情页加载完毕")
    // console.log(options)
    const Id = options.Id
    this.setData({
      furnitureId:Id
    })
    //查商品信息
    wx.request({
      url: `${config.baseURL}/getfurnitureById/${Id}`,
      method: "GET",
      success: res =>{
        // console.log(res)
        this.setData({furnitureData:res.data.data})
      }
    })
    //查商品详情图片
    wx.request({
      url: `${config.baseURL}/GetPictureById/${Id}`,
      method: "GET",
      success: res =>{
        const data = res.data.data
        const arrImg = []
        for (var i = 0; i < data.length; ++i) {
          // console.log(data[i].pictureUrl)
          arrImg.push(data[i].pictureUrl)
         }
        this.setData({arrImg:arrImg})
      }
    })
    const userId = wx.getStorageSync('userId');
    // console.log(userId)
    //如果已经登录就查一个地址
    if(userId !== null && userId !== ''){
      wx.request({
        url: `${config.baseURL}/GetAddressOneByUserId/${userId}`,
        method:'GET',
        success: (res) => {
          this.setData({
            addressRegion:res.data.data.addressRegion
          })
        }
      })
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onClickIcon(e){
    console.log(e)
    const btnName = e.currentTarget.id
    console.log(btnName)
    if (btnName === "购物车") {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
      this.setData({
        infoNumber:null
      })
    }else if (btnName === "客服") {
      wx.showToast({
        title: `请联系管理员`,
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
    }
  },

  AddCart(e){
    console.log(e)
    console.log(this.data.furnitureData.furnitureId)
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
    const furnitureId = this.data.furnitureData.furnitureId
    const requestData = JSON.stringify({
      userId:Number.parseInt(userId),
      cartFurnitureId:furnitureId,
      cartCount:1
    })
    console.log(requestData)
    const token = wx.getStorageSync('X-Token')
    const digestSecret = wx.getStorageSync('DigestSecret')
    wx.request({
      url: `${config.baseURL}/AddCart`,
      method:"POST",
      header:{
        'X-Token':token,
        'X-Digest':SHA256(requestData+digestSecret).toString().toUpperCase()
      },
      data:requestData,
      success:(res) => {
        console.log(res)

      }
    })
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success', // 提示图标，可选值：'success'、'loading'、'none'
      duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
      mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
    })
    if (this.data.infoNumber === null) {
      this.setData({
        infoNumber:1
      })
    }else{
      this.setData({
        infoNumber:this.data.infoNumber+1
      })
    }
  },

  BuyNow(e){
    console.log(e)
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
    let order = []
    order.push({
      BuyNow : true,
      Furniture : this.data.furnitureData,
      Cart : {
        cartCount: 1,
        cartFurnitureId: this.data.furnitureData.furnitureId,
        cartId: null,
        userId: userId
      },
    })
    wx.navigateTo({
      //传商品Id，数量，此次结算总价
      url: `/pages/buy/buy?order=${JSON.stringify(order)}`
    })
  }
  
})