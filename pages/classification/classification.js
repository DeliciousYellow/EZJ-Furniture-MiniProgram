// pages/classification/classification.js
import config from '../../config.js';

Page({
  data: {
    activeKey: 0,
    value:'',
    arrData:[],
    arrTag:[]
  },
  //添加到购物车
  AddCart(){
    console.log("加入购物车")
    
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
  }

})