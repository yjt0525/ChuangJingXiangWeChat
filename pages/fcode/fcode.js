// fcode.js

var timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    QrCodeimg: "",
    QrCodeStr: "",
    invalid:false
  },

  Refresh: function () {
    var me = this;
    wx.request({
      url: 'https://hzcjwl.xyz/SmallAppApi/RefreshFcode',
      method: 'POST',
      data: {
        userid: me.options.userid,
        freecode: me.data.QrCodeStr
      },
      success: function (res) {
        if(res.data.success){
          me.setData({
            QrCodeimg: res.data.imgPath,
            QrCodeStr: res.data.freecode
          });
          clearInterval(timer);
          me.JudgeQrCode();
        }
      }
    })
  },

  JudgeQrCode:function(res){
    var me = this;
    timer = setInterval(function () {
      wx.request({
        url: 'https://hzcjwl.xyz/SmallAppApi/JudegeQrCode',
        method: "POST",
        data: {
          freecode: me.data.QrCodeStr
        },
        success: function (res) {
          console.log(res.data.success);
          if (!res.data.success) {
            console.log("失效");
            clearInterval(timer);
            me.setData({
              invalid: true
            });
            setTimeout(function () {
              me.setData({
                invalid: false
              });
              me.Refresh();
            }, 1000)
          } else {
            console.log("有效");
          }
        }
      })
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    this.setData({
      QrCodeimg: options.imgPath,
      QrCodeStr: options.freecode
    });
    me.JudgeQrCode();
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