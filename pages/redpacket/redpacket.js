// redpacket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Text:'获得奇瑞20周年感恩试驾红包',
    Money:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    console.log(options);
    wx.request({
      url: 'https://hzcjwl.xyz//SmallAppApi/Redpocket',
      method:'POST',
      data:{
        id: options.userRedEnvelopeRecordId
      },
      success:function(res){
        console.log(res);
        console.log(res.data.data.RedEnvelopeAccount)
        if (res.data.data.RedEnvelopeAccount!=0){
          me.setData({
            Money: res.data.data.RedEnvelopeAccount,
            ShowMoney: true
          });
        }else{
          me.setData({
            Money: res.data.data.RedEnvelopeAccount,
            GiftIntroduction: res.data.data.Gift.Introduction,
            GiftPwd: res.data.data.Gift.Pwd,
            GiftId: res.data.data.Gift.UserName,
            ShowMoney: false
          });
        }
      }
    })
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