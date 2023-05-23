// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrImg:
    [
      'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E5%AE%B6%E5%85%B7%E5%9B%BE%E7%89%87/%E7%9C%9F%E7%9A%AE%E5%BA%8A%E8%BD%BB%E5%A5%A2%E7%8E%B0%E4%BB%A3.jpg',
      'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/%E5%AE%B6%E5%85%B7%E5%9B%BE%E7%89%87/%E4%B8%8A%E4%B8%8B%E5%8F%8C%E5%B1%82%E5%85%A8%E5%AE%9E%E6%9C%A8%E5%BA%8A.jpg'
    ],
    furnitureData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("详情页加载完毕")
    console.log(options)
    const Id = options.Id
    wx.request({
      url: 'http://127.0.0.1:8080/getfurnitureById/'+Id,
      method: "GET",
      success: res =>{
        console.log(res)
        // console.log(res.data)
        this.setData({furnitureData:res.data.data})
        // console.log(this.data)
      }
    })
  },
})