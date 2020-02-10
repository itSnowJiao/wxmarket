// components/amount/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: {
      type: Number,
      value: 1
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
    inputChangeHandle(e) {
      console.log(e);
      let value = e.detail.value;
      var myEventDetail = {
        val: val
      }
      // 将数据传递给父组件select
      this.triggerEvent('eventCount', myEventDetail);
    },
    subtract() {
      let count = this.data.count;
      count > 1 ? count-- : 1;
      this.setData({
        count: count
      });
      var myEventDetail = {
        val: count
      }
      // 将数据传递给父组件select
      this.triggerEvent('eventCount', myEventDetail);
      // 点击减号触发
      this.triggerEvent('subevent')
    },
    add() {
      let count = this.data.count;
      this.setData({
        count: ++count
      });
      var myEventDetail = {
        val: count
      }
      // 将数据传递给父组件select
      this.triggerEvent('eventCount', myEventDetail);
      // 点击加号触发
      this.triggerEvent('addevent')
    }
  }
})
