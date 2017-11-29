//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    LogoImg: 'img/logo.png'
  },
  //事件处理函数
  formSubmit: function (e) {
    var me = this;
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    if (e.detail.value.userName === "") {                                                   //手机号为空
      this.modal("手机号不能为空");
    } else if (e.detail.value.password === "") {                                       //密码为空
      this.modal("密码不能为空");
    } else if (!reg.test(e.detail.value.userName)) {                                     //手机号不合法
      this.modal("手机号不合法");
    } else {
      console.log(e.detail.value);
      wx.request({
        url: 'https://hzcjwl.xyz/SmallAppApi/Login',
        method:'POST',
        data: e.detail.value,
        success:function(res){
          console.log(res);
          if(res.data.success){
            wx.navigateTo({
              url: '../fcode/fcode?freecode=' + res.data.freecode + '&imgPath=' + res.data.imgPath +'&userid='+res.data.userid
            })
          }
          else{
            me.modal(res.data.reason+'，请重新输入');
          }
        }
      })
    }
  },

  modal: function (msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },

  onLoad: function () {

  },

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
