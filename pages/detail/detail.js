// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrImg:[],
    furnitureData:[],
    show:false,
    activeNames: ['1'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("详情页加载完毕")
    // console.log(options)
    const Id = options.Id
    //查商品信息
    wx.request({
      url: 'http://127.0.0.1:8080/getfurnitureById/'+Id,
      method: "GET",
      success: res =>{
        // console.log(res)
        this.setData({furnitureData:res.data.data})
      }
    })
    //查商品详情图片
    wx.request({
      url: 'http://127.0.0.1:8080/GetPictureById/'+Id,
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
})