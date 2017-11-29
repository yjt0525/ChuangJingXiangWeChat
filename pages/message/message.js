// message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StaticImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/static.png",
    BgImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/bg.png",
    LogoImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/logo.png",
    ShowMessage:true,
    ShowHistoryGift:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log(opt);
    if(opt.msg.indexOf('奖')>-1){
      this.setData({
        ShowHistoryGift:true,
        ShowMessage:false,
        redmoney:opt.redmoney,
        giftid:opt.giftid,
        giftintroduct:opt.giftintroduct,
        giftpwd:opt.giftpwd,
        showredmoney:opt.redmoney!=0,
        // showgiftid: opt.giftid==="null"?false:true,
        // showgiftintroduct: opt.giftintroduct==='null'?false:true,
        // showgiftpwd: opt.giftpwd==='null'?false:true
      })
    }
    else{
      this.setData({
        Message:opt.msg
      })
    }
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