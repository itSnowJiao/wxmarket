// components/IOU/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideBaitiao: {
      type: Boolean,
      value: true
    },
    baitiao: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 设置一个被选择的index
    selectIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideBaitiaoView(e) {
      if(e.currentTarget.dataset.target == 'self') {
        this.setData({
          hideBaitiao: true
        })
      }
    },
    changeItem(e) {
      let index = e.currentTarget.dataset.index;
      let baitiao = this.data.baitiao;
      for(let i = 0; i < baitiao.length; i ++) {
        baitiao[i].select = false;
      }
      baitiao[index].select = !baitiao[index].select;
      this.setData({
        baitiao: baitiao,
        // 改变selectIndex为index索引值
        selectIndex: index
      })
    },
    handleBaitiao(e) {
      // 隐藏白条弹窗
      this.setData({
        hideBaitiao: true
      })
      // 获取当前选择的内容复制
      const selectItem = this.data.baitiao[this.data.selectIndex];
      // 注册事件传递给父组件
      this.triggerEvent('updateSelect', selectItem);
    }
  }
})
