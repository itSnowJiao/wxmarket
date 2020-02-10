// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArray: [],
    selectAll: false, //是否全选
    totalMoney: '0.00', // 总价
    totalCount: 0, // 商品总数
    startX: 0, // 开始坐标
    startY: 0 //开始坐标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取本地存储的数据信息
    let self = this;
    wx.getStorage({
      key: 'cartInfo',
      success: function(res) {
        const cartArray = res.data;
        // 设置新的属性
        cartArray.forEach(cart => {
          cart.select = false, // 是否选中
          cart.isTouchMove = false // 是否滑动
        });
        // 更新数据
        self.setData({
          cartArray: cartArray,
          // 初始状态时，让总价、总数为0，选中状态为false
          totalMoney: "0.00",
          totalCount: 0,
          selectAll: false
        })
        // 设置Tabbar图标
        cartArray.length > 0 ?
          wx.setTabBarBadge({
            index: 2,
            text: String(cartArray.length)
          }) : wx.removeTabBarBadge({
            index: 2,
          })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 在页面离开时更新cartArray的数据信息
    let cartArray = this.data.cartArray;
    wx.setStorage({
      key: 'cartInfo',
      data: cartArray,
    })
  },



  // 更新选择的数量
  onCount(e) {
    // console.log(e);
    let index = e.currentTarget.dataset.index;
    let cartArray = this.data.cartArray;
    cartArray[index].total = e.detail.val;
    this.setData({
      cartArray: cartArray
    })
  },

  // 点击商品列表跳转到详情页面
  switchToDetails(e) {
    let index = e.currentTarget.dataset.index;
    let cartArray = this.data.cartArray;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + cartArray[index].id,
    })
  },

  // 选择商品
  selectGoods(e) {
    let index = e.currentTarget.dataset.index;
    let cartArray = this.data.cartArray;
    // 获取合计和数量
    let totalCount = this.data.totalCount;
    let totalMoney = Number(this.data.totalMoney);
    // 获取selectAll,用于在全选后让其中一个不选中来更改状态
    let selectAll = this.data.selectAll;
    // 设置选中或不选中状态
    cartArray[index].select = !cartArray[index].select;
    // 判断当前商品是否被选中
    if (cartArray[index].select) { // 选中
      totalMoney += Number(cartArray[index].price) * cartArray[index].total;
      totalCount++;
    } else { // 不选中
      totalMoney -= Number(cartArray[index].price) * cartArray[index].total;
      totalCount--;
      // 不全选中时修改全选的状态
      selectAll = false;
    };
    // 更新数据
    this.setData({
      cartArray: cartArray,
      totalMoney: String(totalMoney.toFixed(2)),
      totalCount: totalCount,
      selectAll: selectAll
    })
  },

  // 自增和自减
  subCount(e) {
    let index = e.currentTarget.dataset.index;
    let cartArray = this.data.cartArray;

    // 合计
    let totalMoney = Number(this.data.totalMoney);
    // 判断商品是否选中
    if (cartArray[index].select) {
      // 计算金额
      totalMoney -= Number(cartArray[index].price);
    };
    // 更新数据
    this.setData({
      totalMoney: String(totalMoney.toFixed(2))
    })
  },

  addCount(e) {
    let index = e.currentTarget.dataset.index;
    let cartArray = this.data.cartArray;
    // 合计
    let totalMoney = Number(this.data.totalMoney);
    // 判断商品是否选中
    if (cartArray[index].select) {
      // 计算金额
      totalMoney += Number(cartArray[index].price);
    };
    // 更新数据
    this.setData({
      totalMoney: String(totalMoney.toFixed(2))
    })
  },

  // 全选和全不选
  selectAll() {
    let cartArray = this.data.cartArray;
    let totalCount = 0;
    let totalMoney = 0;
    let selectAll = this.data.selectAll;
    // 取反
    selectAll = !selectAll;
    // 遍历数组，得到每个cart元素的选中状态
    cartArray.forEach(cart => {
      cart.select = selectAll; // 统一每个元素的选中或不选中状态
      // 计算总金额和商品个数
      if (cart.select) {
        totalMoney += Number(cart.price) * cart.total;
        totalCount++;
      } else { // 置为0
        totalMoney = 0;
        totalCount = 0;
      }
    })
    // 更新数据
    this.setData({
      cartArray: cartArray,
      totalMoney: String(totalMoney.toFixed(2)),
      totalCount: totalCount,
      selectAll: selectAll
    })
  },

  // 手指触摸弧度
  touchStart(e) { // 手指刚触摸时发生的事件，只触发一次
    // console.log(e);
    let cartArray = this.data.cartArray;
    // 开始触摸时重置所有删除
    cartArray.forEach(cart => {
      if(cart.isTouchMove) { // 当当前触摸的为true时
        cart.isTouchMove = false // 让其他的都为false
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartArray: cartArray
    })
  },
  touchMove(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    // 开始的x和y坐标
    let startX = self.data.startX,
        startY = self.data.startY;
    // 移动的x和y坐标
    let moveX = e.changedTouches[0].clientX,
        moveY = e.changedTouches[0].clientY;

    // 计算角度方法，获取角度
    let angle = self.angle({X: startX, Y: startY},{X: moveX, Y: moveY});

    // 遍历数组对象，判断是否是当前项目，判断是左滑还是右滑
    let cartArray = self.data.cartArray;
    cartArray.forEach((cart,i) => {
      cart.isTouchMove = false;
      // 滑动角度>30时直接return
      if(Math.abs(angle) > 30) return;
      // 匹配当前滑动对象
      if(i == index) {
        if(moveX > startX) { // 表示右滑
          cart.isTouchMove = false
        } else {
          cart.isTouchMove = true;
        }
      }
    })
    // 更新数据
    self.setData({
      cartArray: cartArray
    })
  },
  // angel方法
  angle(start,end) {
    let _X = end.X - start.X;
    let _Y = end.Y - start.Y;
    // 返回角度，运用Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  del: function (e) {
    var index = e.currentTarget.dataset.index
    var self = this

    // 删除storage
    wx.getStorage({
      key: 'cartInfo',
      success: function (res) {
        const partData = res.data
        partData.forEach((cart, i) => {
          if (cart.title == self.data.cartArray[index].title) {
            partData.splice(i, 1)
          }
        })
        wx.setStorage({
          key: 'cartInfo',
          data: partData
        })
        self.update(index)
      }
    })
  },

  // 更新数据的方法
  update: function (index) {
    var cartArray = this.data.cartArray
    let totalMoney = Number(this.data.totalMoney)
    let totalCount = this.data.totalCount
    // 计算价格和数量
    if (cartArray[index].select) {
      totalMoney -= Number(cartArray[index].price) * cartArray[index].total
      totalCount--
    }
    // 删除
    cartArray.splice(index, 1)
    // 更新数据
    this.setData({
      cartArray: this.data.cartArray,
      totalCount: totalCount,
      totalMoney: String(totalMoney.toFixed(2))
    })

    // 设置Tabbar图标
    cartArray.length > 0 ?
      wx.setTabBarBadge({
        index: 2,
        text: String(cartArray.length)
      }) : wx.removeTabBarBadge({
        index: 2,
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})