// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    time:1000*60*60*24*3,
    arrImg:[
    'http://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE1.jpg',
    'http://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE2.jpg',
    'http://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE3.jpg'
    ],
    arrData:[],
  },
  
  //这是宫格分类跳转到分类页面
  bindTag(e){
    // console.log("触发")
    // console.log(e)
    // console.log(wx.createSelectorQuery().select('#item'))
    var name = e.currentTarget.dataset.name;
    // this.setData({TagName:name})
    wx.setStorageSync('TagName', name);
    wx.switchTab({
      url: '/pages/classification/classification',
    })
    wx.setStorageSync('IsAll', -1);
  },

  Jump(e){
    var Id = e.currentTarget.dataset.furnitureid;
    console.log(Id)
    console.log(e)
    wx.navigateTo({
      url: '/pages/detail/detail?Id='+Id,  
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '易筑家商城'
    })
    // console.log("页面加载完毕")
    wx.request({
      url: 'http://127.0.0.1:8080/getfurnitureall',
      method: "GET",
      success: res =>{
        // console.log(res)
        // console.log(res.data)
        this.setData({arrData:res.data.data})
        // console.log(this.data)
      }
    })
  },
})