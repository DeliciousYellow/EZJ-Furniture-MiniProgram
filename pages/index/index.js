// pages/setting/setting.js
import config from '../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    time:1000*60*60*24*3,
    arrImg:[
    'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE1.jpg',
    'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE2.jpg',
    'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE3.jpg'
    ],
    arrData:[],
  },
  //立即购买按钮
  BuyNow(){
    console.log("立即购买")
  },
  
  // getRandomHeight() {
  //   // 生成一个介于200到400之间的随机数作为高度
  //   return Math.floor(Math.random() * (400 - 200 + 1) + 200) + 'px';
  // },

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
      url: `${config.baseURL}/getfurnitureall`,
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