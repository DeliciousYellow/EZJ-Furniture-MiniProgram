// pages/cart/cart.js
import config from '../../config.js'
import { SHA256 } from 'crypto-js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartData:[],
    unHasData:true,
    value:null,
    flag:false,//用于标记阻止事件冒泡，组件方法是bind：click，导致我不能用catchtap
    money:0,//实际价格
    sum:0,//表示字符
    allCheck:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    const userId = wx.getStorageSync('userId')
    console.log(userId)
    if(userId == null || userId == ''){
      return
    }
    wx.request({
      url: `${config.baseURL}/GetCartByUserId/${userId}`,
      method:"GET",
      success: (res) => {
        console.log(res)
        if (res.data.data.length != 0) {
          res.data.data.forEach((item) => {
            item.checked = false;
          })
        }
        console.log("长度")
        console.log(res.data.data.length)
        this.setData({
          cartData:res.data.data,
          unHasData: res.data.data.length==0 ? true : false 
        })
      }
    })
  },

  tapCheck(e){
    if (this.data.flag) {
      this.setData({
        flag:false
      })
      return
    }
    console.log(e.currentTarget.id)
    const data = this.data.cartData;
    data[e.currentTarget.id].checked = !data[e.currentTarget.id].checked
    this.setData({
      cartData:data
    })
    this.GetMoney()
  },

  onChange(e) {
    // console.log("数量改变")
    console.log(e);
    // console.log(e.currentTarget.id)
    const data = this.data.cartData
    //步进器的值改变后，更改购物车信息的数量
    data[e.currentTarget.id].Cart.cartCount = e.detail
    // console.log(this.data.cartData)
    this.setData({
      cartData:data,
      flag:true
    })
    this.GetMoney()
    const cart = this.data.cartData[e.currentTarget.id].Cart
    const requestData = JSON.stringify({
      userId:cart.userId,
      cartFurnitureId:cart.cartFurnitureId,
      cartCount:cart.cartCount
    })
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
  },

  getFocus(){
    console.log("获得焦点")
    this.setData({
      flag:true
    })
  },

  allChange(){
    const bool = this.data.allCheck
    const data = this.data.cartData
      data.forEach((item) => {
        item.checked = !bool
      })
      this.setData({
        cartData:data,
        allCheck:!bool
      })
    this.GetMoney()
  },

  remove(){
    const data = this.data.cartData
    console.log(data)
    const requestPromises = data.map(item => {
      if (item.checked) {
        const requestData = JSON.stringify(item.Cart);
        console.log(requestData);
        const token = wx.getStorageSync('X-Token');
        const digestSecret = wx.getStorageSync('DigestSecret');
        return new Promise((resolve, reject) => {
          wx.request({
            url: `${config.baseURL}/DeleteCart`,
            method: "DELETE",
            header: {
              'X-Token': token,
              'X-Digest': SHA256(requestData + digestSecret).toString().toUpperCase()
            },
            data: requestData,
            success: res => {
              console.log(res);
              resolve(); // 请求成功时，将 Promise 标记为已完成
            },
            fail: error => {
              console.error(error);
              reject(error); // 请求失败时，将 Promise 标记为已失败
            }
          });
        });
      }
    });
    Promise.all(requestPromises)
      .then(() => {
        console.log("所有请求已完成");
        // 执行接下来的逻辑
        // this.setData({
        //   unHasData : true
        // })
        this.onShow()
      })
      .catch(error => {
        console.error("请求失败：", error);
      });
  },

  GoHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  GetMoney(){
    const data = this.data.cartData
    console.log(data)
    let money = 0
    data.forEach((item) => {
      if(item.checked){
        money += item.Furniture.furniturePrice*item.Cart.cartCount
      }
    })
    console.log(money)
    this.setData({
      money: money,
      sum: money*100
    })
  },

  onClickButton(){
    let order = []
    this.data.cartData.forEach((item) => {
      if (item.checked) {
        order.push({
          Furniture : item.Furniture,
          Cart : item.Cart,
        })
      }
    })
    wx.navigateTo({
      //传商品Id，数量，此次结算总价
      url: `/pages/buy/buy?order=${JSON.stringify(order)}`
    })
  }
})