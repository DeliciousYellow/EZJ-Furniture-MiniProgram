// pages/classification/classification.js

Page({
  data: {
    activeKey: 0,
    value:'',
    arrData:[],
    arrTag:[]
  },

  onChange(event) {
    // console.log(this.data.arrTag[event.detail-1].tagDetail)
    // console.log("标签转换,当前标签为"+event.detail)
    this.setData({activeKey:event.detail})
    if (event.detail === 0) {
      wx.setStorageSync('IsAll', 0);
    }else{
      wx.setStorageSync('IsAll', -1);
      // console.log(this.data.arrTag[event.detail-1].tagDetail)
      wx.setStorageSync('TagName', this.data.arrTag[event.detail-1].tagDetail);
    }
    // console.log(this.data.activeKey)
    if (event.detail==0) {
      //默认第一个标签是全部查询
      // console.log("全部")
      wx.request({
        url: 'http://127.0.0.1:8080/getfurnitureall',
        method:"GET",
        success: res=>{
          this.setData({arrData:res.data})
        }
      })
    } else {
      // console.log("其他")
      // console.log(event.detail)
      // console.log(this.data.arrTag[event.detail].tagDetail)
      wx.request({
        url: 'http://127.0.0.1:8080/getfurnitureByTag/'+this.data.arrTag[event.detail-1].tagDetail,
        method:"GET",
        success: res=>{
          this.setData({arrData:res.data})
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
      url: 'http://127.0.0.1:8080/getfurnitureall',
      method: "GET",
      success: res =>{
        this.setData({arrData:res.data})
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
        url: 'http://127.0.0.1:8080/gettag/类型',
        method: "GET",
        success: res =>{
          // console.log(res.data)
          this.setData({arrTag:res.data})
        }
      })
      wx.request({
        url: 'http://127.0.0.1:8080/getfurnitureall',
        method: "GET",
        success: res =>{
          this.setData({arrData:res.data,activeKey:0})
        }
      })
    }else{
      wx.request({
        url: 'http://127.0.0.1:8080/gettag/类型',
        method: "GET",
        success: res =>{
          // console.log(res.data)
          this.setData({arrTag:res.data})
          const value = wx.getStorageSync('TagName')
          // console.log(value)
          for (var i = 0; i < this.data.arrTag.length; i++) {
            if(this.data.arrTag[i].tagDetail===value){
              break;
            }
          }
          // console.log(i)
          this.setData({activeKey:i+1})
          wx.request({
            url: 'http://127.0.0.1:8080/getfurnitureByTag/'+this.data.arrTag[i].tagDetail,
            method:"GET",
            success: res=>{
              this.setData({arrData:res.data})
            }
          })
        }
      })
    }
  }

})