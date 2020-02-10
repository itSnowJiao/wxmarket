// components/select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideSelect: {
      type: Boolean,
      value: true
    },
    partData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击空白和x，让弹窗消失
    hideBuyView(e) {
      if(e.target.dataset.target == 'self') {
        this.setData({
          hideSelect: true
        })
      }
    },
    onCount(e) {
      console.log(e);
      let value = e.detail;
      // 将数据传递给父组件detail
      this.triggerEvent('updateCount',value)
    },
    cartEvent() {
      // 隐藏弹窗
      this.setData({
        hideSelect: true
      });
      // 传递事件
      this.triggerEvent('buyEvent')
    }
  }
})
