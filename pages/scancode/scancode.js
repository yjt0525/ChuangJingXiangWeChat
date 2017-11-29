// camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  ScanCode: function () {
    var me = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        console.log(res.result);
        var obj = res.result.split(';');
        me.setData({
          redEnvelopAreaInfoname:obj[0].split('=')[1],
          redEnvelopAreaInfoid: obj[1].split('=')[1],
          freecode: obj[2].split('=')[1],
          userid: obj[3].split('=')[1],
          ActivityRecordId: obj[4].split('=')[1],
        });
        wx.redirectTo({
          url: '../form/form?activityRecordid=' + me.data.ActivityRecordId + '&redEnvelopAreaInfoname=' + me.data.redEnvelopAreaInfoname + '&redEnvelopAreaInfoid=' + me.data.redEnvelopAreaInfoid + '&fcode='+me.data.freecode+'&userid=' + me.data.userid
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '奇瑞20周年，荣耀与你共享',
      path: '/pages/index/index',
      imageUrl: '/img/share.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})