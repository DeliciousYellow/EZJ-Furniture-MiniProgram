// pages/classification/classification.js

Page({
  data: {
    active: 1,
  },

  onLoad(options) {
    const index = parseInt(options.index)
    console.log(index)
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    this.setData({
      active:index
    });
    console.log(this.data.active)
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
    //在这个事件中更改渲染的订单
  },

})