// pages/classification/classification.js
import config from '../../config.js'
import { SHA256 } from 'crypto-js'

Page({
  data: {
    activeKey: 0,
    value:'',
    arrData:[],
    arrTag:[]
  },

  //商品详情页面跳转
  Jump(e){
    var Id = e.currentTarget.dataset.furnitureid;
    console.log(Id)
    console.log(e)
    wx.navigateTo({
      url: '/pages/detail/detail?Id='+Id,  
    })
  },

  onChange(event) {
    // console.log(this.data.arrTag[event.detail-1].tagName)
    // console.log("标签转换,当前标签为"+event.detail)
    this.setData({activeKey:event.detail})
    if (event.detail === 0) {
      wx.setStorageSync('IsAll', 0);
    }else{
      wx.setStorageSync('IsAll', -1);
      // console.log(this.data.arrTag[event.detail-1].tagName)
      wx.setStorageSync('TagName', this.data.arrTag[event.detail-1].tagName);
    }
    // console.log(this.data.activeKey)
    if (event.detail==0) {
      //默认第一个标签是全部查询
      // console.log("全部")
      wx.request({
        url: `${config.baseURL}/getfurnitureall`,
        method:"GET",
        success: res=>{
          this.setData({arrData:res.data.data})
        }
      })
    } else {
      // console.log("其他")
      // console.log(event.detail)
      // console.log(this.data.arrTag[event.detail].tagName)
      wx.request({
        url: `${config.baseURL}/getfurnitureByTag/${this.data.arrTag[event.detail-1].tagName}`,
        method:"GET",
        success: res=>{
          this.setData({arrData:res.data.data})
        }
      })
    }
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '商品分类'
    })
    // console.log("页面加载完毕")
    //请求右侧商品列表
    wx.request({
      url: `${config.baseURL}/getfurnitureall`,
      method: "GET",
      success: res =>{
        this.setData({arrData:res.data.data})
      }
    })
  },
  onShow() {
    //请求左侧标签列表
    // console.log("分类页面显示")
    const A = wx.getStorageSync('IsAll')
    // console.log(A)
    if(A===0){
      wx.request({
        url: `${config.baseURL}/gettag/类型`,
        method: "GET",
        success: res =>{
          // console.log(res.data)
          this.setData({arrTag:res.data.data})
        }
      })
      wx.request({
        url: `${config.baseURL}/getfurnitureall`,
        method: "GET",
        success: res =>{
          this.setData({arrData:res.data.data,activeKey:0})
        }
      })
    }else{
      wx.request({
        url: `${config.baseURL}/gettag/类型`,
        method: "GET",
        success: res =>{
          // console.log(res.data)
          this.setData({arrTag:res.data.data})
          const value = wx.getStorageSync('TagName')
          // console.log(value)
          for (var i = 0; i < this.data.arrTag.length; i++) {
            if(this.data.arrTag[i].tagName===value){
              break;
            }
          }
          // console.log(i)
          this.setData({activeKey:i+1})
          wx.request({
            url: `${config.baseURL}/getfurnitureByTag/${this.data.arrTag[i].tagName}`,
            method:"GET",
            success: res=>{
              this.setData({arrData:res.data.data})
            }
          })
        }
      })
    }
  },

  //添加到购物车
  AddCart(e){
    console.log(e)
    console.log(this.data)
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
    const furnitureId = Number.parseInt(e.currentTarget.id)
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

})