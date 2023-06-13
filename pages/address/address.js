// pages/address/address.js
import { useCascaderAreaData  } from '../../miniprogram_npm/@vant/weapp/area-data/dist/data';
import config from '../../config.js';
import { SHA256 } from 'crypto-js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrAddress:[
      {
        userId : 1,
        consigneeName:"张三",
        consigneeNumber:"00000000000",
        address : "北京市···",
        checked : true
      },
    ],
    checkedAddress:{
      userId : 1,
      consigneeName:"张三",
      consigneeNumber:"00000000000",
      address : "北京市···",
      checked : true
    },
    show: false,
    options:null,
    fieldValue: '',
    cascaderValue: '',

    name:'',
    number:'',
    address:''

  },

  Submit(){
    // console.log(this.data.fieldValue)
    // console.log(this.data.name)
    // console.log(this.data.number)
    // console.log(`${this.data.fieldValue}/${this.data.address}`)
    const textRule = /^.{2,}$/;
    if (!textRule.test(this.data.name)) {
      wx.showToast({
        title: '收货人姓名需要大于等于两个字符',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
      return;
    }
    //手机号验证
    const numberRule = /^[1][3-9]\d{9}$/;
    if (!numberRule.test(this.data.number)) {
      // 手机号码格式不正确
      wx.showToast({
        title: '这不是一个手机号码',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
      return;
    }
    if (!textRule.test(this.data.fieldValue)) {
      wx.showToast({
        title: '还未选择地区',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
      return;
    }
    if (!textRule.test(this.data.address)) {
      wx.showToast({
        title: '详细地址需要大于等于两个字符',
        icon: 'none', // 提示图标，可选值：'success'、'loading'、'none'
        duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
      })
      return;
    }
    
    // console.log("发送")
    const token = wx.getStorageSync('X-Token')
    const digestSecret = wx.getStorageSync('DigestSecret')
    const userId = wx.getStorageSync('userId')

    // console.log(token)
    // console.log(userId)
    const address = JSON.stringify({
      userId:userId,
      consigneeName:this.data.name,
      consigneeNumber:this.data.number,
      addressRegion:this.data.fieldValue,
      addressDetail:`/${this.data.address}`
    })
    console.log(address+digestSecret)
    console.log(`生成的摘要：${SHA256(address+digestSecret).toString()}`)
    wx.request({
      url: `${config.baseURL}/AddAddress/`,
      method:'POST',
      header:{
        'X-Token':token,
        'X-Digest':SHA256(address+digestSecret).toString().toUpperCase()
      },
      timeout: 5000,
      data:address,
      success : (res) =>{
        wx.showToast({
          title: '添加成功',
          icon: 'success', // 提示图标，可选值：'success'、'loading'、'none'
          duration: 2000, // 提示显示时间，单位为毫秒，默认为1500
          mask: false, // 是否显示透明蒙层，防止触摸穿透，默认为false
        })
      }
    })
  },

  radioClick(event) {
    const { name } = event.currentTarget.dataset
    const { arrAddress } = this.data
    arrAddress.forEach(item => {
      item.checked = item.userId === name+1;
      if (item.checked) {
        //如果当前地址被选择，把他变成当前地址
        this.setData({
          checkedAddress:item
        })
      }
    })
    this.setData({
      arrAddress
    })
    //当前地址
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userId = wx.getStorageSync('userId');
    wx.request({
      url: `${config.baseURL}/GetAddressByUserId/${userId}`,
      method:'GET',
      success: (res) => {
        console.log(res)
        const arrAddress = []
        res.data.data.forEach((item,index) => {
          arrAddress.push({
            userId : index+1,
            consigneeName: item.consigneeName,
            consigneeNumber: item.consigneeNumber,
            address : item.addressRegion+item.addressDetail,
            checked : false
          })
        })
        arrAddress[0].checked = true
        this.setData({
          arrAddress:arrAddress,
          checkedAddress:arrAddress[0]
        })

      }
    })
  },
  
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },

  onClick() {
    this.setData({
      show: true,
    });
    const options = useCascaderAreaData()
    this.setData({
      options:options
    })
  },

  onClose() {
    this.setData({
      show: false,
    });
  },

  onFinish(e) {
    const { selectedOptions, value } = e.detail;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join('/');
        
    this.setData({
      fieldValue,
      cascaderValue: value,
    })
    this.onClose();
    console.log(this.data.fieldValue)
    
  },
})
