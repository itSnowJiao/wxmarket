// pages/list/index.js
const interfaces = require('../../utils/urlConfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prolist: [],
    page: 1,
    size: 5,
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    // console.log(options);
    // 改变导航标题
    wx.setNavigationBarTitle({
      title: options.title,
    });
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: interfaces.productionsList,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        self.setData({
          prolist: res.data
        });
        wx.hideLoading();
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 加载样式在导航标题中显示
    wx.showNavigationBarLoading();
    // 上拉刷新时恢复页数到第一页
    this.setData({
      page: 1,
      noData: false
    });
    // 请求数据
    const self = this;
    wx.request({
      url: interfaces.productionsList,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        self.setData({
          prolist: res.data
        });
        // 数据获取成功后，隐藏加载样式
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 停止下拉刷新
    wx.stopPullDownRefresh();
    // 显示导航加载
    wx.showNavigationBarLoading();
    // 获取参数
    const prolist = this.data.prolist;
    let page = this.data.page;
    // 设置页数变化
    this.setData({
      page: ++page
    });
    // 获取数据
    const self = this;
    wx.request({
      url: interfaces.productionsList + '/' + self.data.page + '/' + self.data.size,
      success(res) {
        if (res.data.length == 0) {
          self.setData({
            noData: true
          })
        } else {
          res.data.forEach(function(item) {
            prolist.push(item)
          });
          self.setData({
            prolist: prolist
          });
        };
        // 隐藏加载状态
        wx.hideNavigationBarLoading();
      }
    })
  },

  switchProlistDetail(e) {
    // console.log(e)
    // 获取点击项的index
    let index = e.currentTarget.dataset.index;
    // 导航跳转
    wx.navigateTo({
      url: '/pages/detail/index?id=' + this.data.prolist[index].id,
    })
  }
})