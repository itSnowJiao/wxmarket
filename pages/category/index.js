// pages/category/index.js
const interfaces = require('../../utils/urlConfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navLeftItems: [],
    navRightItems: [],
    curIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    // 获取分类数据
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: interfaces.productions,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        self.setData({
          navLeftItems: res.data.navLeftItems,
          navRightItems: res.data.navRightItems
        });
        wx.hideLoading();
      }
    })
  },
  switchTabNav(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index
    })
  },
  showListView(e) {
    let text = e.currentTarget.dataset.text;
    // 导航跳转
    wx.navigateTo({
      url: '/pages/list/index?title=' + text,
    })
  }
})