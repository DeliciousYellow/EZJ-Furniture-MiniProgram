// pages/classification/classification.js
import config from '../../config.js'
const wxp = require('wx-promise-pro').default;

Page({
  data: {
    unHasData: true,
    active: 0,
    value: '',
    order:[
      {
        Cart:{
          cartCount: 15,
          cartFurnitureId: 917,
          cartId: 16,
          userId: 21
        },
        Furniture:{
          detailedInformation: "网纳厨房置物架落地厨房客厅层架储物架微波炉架货架杂物收纳架1805W1",
          furnitureId: 917,
          furnitureName: "网纳厨房置物架",
          furniturePrice: 99,
          furnitureQuantity: 999,
          furnitureUrl: "https://img10.360buyimg.com/n7/jfs/t1/218311/26/27942/107281/646db895F48118878/d0f2df11d8fb6de3.jpg",
          originPrice: 120,
        }
      },
      {
        Cart:{
          cartCount: 15,
          cartFurnitureId: 917,
          cartId: 16,
          userId: 21
        },
        Furniture:{
          detailedInformation: "网纳厨房置物架落地厨房客厅层架储物架微波炉架货架杂物收纳架1805W1",
          furnitureId: 917,
          furnitureName: "网纳厨房置物架",
          furniturePrice: 99,
          furnitureQuantity: 999,
          furnitureUrl: "https://img10.360buyimg.com/n7/jfs/t1/218311/26/27942/107281/646db895F48118878/d0f2df11d8fb6de3.jpg",
          originPrice: 120,
        }
      },
    ],
    orderArr:[],
  },

  onLoad(options) {
    const index = parseInt(options.index)
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    const userId = Number.parseInt(wx.getStorageSync('userId'))
    console.log(userId)
    wx.request({
      url: `${config.baseURL}/GetOrderByUserId/${userId}`,
      method:'GET',
      header:{
        'X-Token': wx.getStorageSync('X-Token')
      },
      success: (res) => {
        console.log(res)
        let orderArr = []
        // res.data.data.forEach((items) => {
        //   let orderlist = []
        //   //订单编码和订单备注只用push一次
        //   let orderCode = null
        //   let creatTime = null
        //   let orderComment = null
        //   let allMoney = 0
        //   const requestPromises = items.map(item => {
        //     return new Promise((resolve, reject) => {
        //       wx.request({
        //         url: `${config.baseURL}/getfurnitureById/${item.furnitureId}`,
        //         method: 'GET',
        //         success: res => {
        //           const furniture = res.data.data
        //           const money = furniture.furniturePrice * item.orderCount
        //           allMoney += money
        //           orderlist.push({
        //             orderCount: item.orderCount,
        //             furniture: furniture,
        //             money: money
        //           })
        //           resolve(); // 请求成功时，将 Promise 标记为已完成
        //         },
        //         fail: error => {
        //           reject(error); // 请求失败时，将 Promise 标记为已失败
        //         }
        //       });
        //     });
        //   });
        //   Promise.all(requestPromises)
        //   .then(() => {
        //     // 在所有请求完成后执行的逻辑
        //     console.log("所有请求已完成");
        //     console.log("总金额：" + allMoney);
        //     console.log("订单列表：", orderlist);
        //     orderArr.push({
        //       orderlist: orderlist,
        //       orderCode: orderCode,
        //       creatTime: creatTime,
        //       allMoney: allMoney,
        //       orderComment: orderComment
        //     })
        //   })
        // })
        const promiseArray = res.data.data.map(items => {
          let orderlist = [];
          let orderCode = null;
          let creatTime = null;
          let orderComment = null;
          let orderState = null;
          let allMoney = 0;
          const requestPromises = items.map(item => {
            return new Promise((resolve, reject) => {
              orderCode = item.orderCode
              creatTime = item.creatTime
              orderState = item.orderState
              orderComment = item.orderComment
              wx.request({
                url: `${config.baseURL}/getfurnitureById/${item.furnitureId}`,
                method: 'GET',
                success: res => {
                  const furniture = res.data.data;
                  const money = furniture.furniturePrice * item.orderCount;
                  allMoney += money;
                  orderlist.push({
                    orderCount: item.orderCount,
                    furniture: furniture,
                    money: money
                  });
                  resolve(); // 请求成功时，将 Promise 标记为已完成
                },
                fail: error => {
                  reject(error); // 请求失败时，将 Promise 标记为已失败
                }
              });
            });
          });
          return Promise.all(requestPromises)
            .then(() => {
              // 在当前请求完成后执行的逻辑
              console.log("所有请求已完成");
              console.log("总金额：" + allMoney);
              console.log("订单列表：", orderlist);
              orderArr.push({
                orderlist: orderlist,
                orderCode: orderCode,
                creatTime: creatTime,
                orderState: orderState,
                allMoney: allMoney,
                orderComment: orderComment
              });
            });
        });
        Promise.all(promiseArray)
          .then(() => {
            // 在所有请求完成后执行的逻辑
            console.log("数组已经准备好了");
            console.log("最终数组：", orderArr);
            // 在这里可以继续处理后续逻辑
            this.setData({
              orderArr:orderArr
            })
            console.log(options)
            if (this.data.orderArr.length != 0  && options.index == "0") {
              this.setData({
                unHasData: false
              })
            }
            //切换页面
            this.setData({
              active:index
            });
          })
      }
    })
  },

  onChange(e) {
    wx.showToast({
      title: `切换到标签 ${e.detail.name}`,
      icon: 'none',
    })
    console.log(e)
    //如果选择的标签是全部，就是orderArr数组中是否有数据
    //注：这里全部的前后空格一定要保留
    if (e.detail.title==" 全部 " && this.data.orderArr.length != 0) {
      this.setData({
        unHasData: false
      })
      return
    }
    //在这个事件中更改渲染的订单
    console.log(e.detail.title)
    let flag = true
    this.data.orderArr.forEach((item) => {
      console.log(item)
      if (item.orderState == e.detail.title) {
        console.log("AAAAA")
        flag = false
      }
    })
    this.setData({
      unHasData: flag
    })
  },

})