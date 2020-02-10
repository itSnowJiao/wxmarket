// pages/detail/index.js
const interfaces = require('../../utils/urlConfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baitiao: [],
    partData: {},
    baitiaoSelectItem: {
      desc: "【白条支付】首单享立减优惠"
    },
    hideBaitiao: true,
    hideSelect: true,
    badgeCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const id = options.id;
    const self = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: interfaces.productionDetail,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        let result = null;
        res.data.forEach(data => {
          // 判断id是否相等
          if (data.partData.id == id) {
            result = data;
          }
        });
        // 赋值
        self.setData({
          baitiao: result.baitiao,
          partData: result.partData
        })
        // 隐藏加载
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 在刷新页面的时候，也能获取已有的数据信息
    const self = this;
    wx.getStorage({
      key: 'cartInfo',
      success(res) {
        const cartArray = res.data
        self.setBadge(cartArray)
      },
    })
  },

  // 白条的事件
  popBaitiaoView() {
    // console.log('白条')
    this.setData({
      hideBaitiao: false
    })
  },
  // 接收从IOU子组件传递过来的事件
  updateSelectItem(e) {
    // console.log(e);
    // 改变支付处的文字说明
    this.setData({
      baitiaoSelectItem: e.detail
    })
  },
  // 已选的事件
  popBuyView() {
    this.setData({
      hideSelect: false
    })
  },

  // 更新选择的件数
  updateCount(e) {
    console.log(e);
    let partData = this.data.partData;
    partData.count = e.detail.val;
    this.setData({
      partData: partData
    })
  },
  // 加入购物车的事件
  addCart() {
    var self = this
    wx.getStorage({
      key: 'cartInfo',
      success(res) {
        const cartArray = res.data
        let partData = self.data.partData
        let isExit = false; // 判断数组是否存在该商品
        cartArray.forEach(cart => {
          if (cart.id == partData.id) { // 存在该商品
            isExit = true
            cart.total += self.data.partData.count
            wx.setStorage({
              key: 'cartInfo',
              data: cartArray,
            })
          }
        })
        if (!isExit) { // 不存在该商品
          partData.total = self.data.partData.count
          cartArray.push(partData)
          wx.setStorage({
            key: 'cartInfo',
            data: cartArray,
          })
        }
        self.setBadge(cartArray)
      },
      fail() {
        let partData = self.data.partData
        partData.total = self.data.partData.count
        let cartArray = []
        cartArray.push(partData)
        wx.setStorage({
          key: 'cartInfo',
          data: cartArray,
        })
        self.setBadge(cartArray)
      }
    })
    // 购物车提醒
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 3000
    })
  },
  // 商品数量的事件
  setBadge(cartArray) {
    this.setData({
      badgeCount: cartArray.length
    })
  },

  // 购物车的跳转
  goCart() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  }
})