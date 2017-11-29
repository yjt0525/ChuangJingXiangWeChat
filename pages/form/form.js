// form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Bg: 'http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/form/formbg.png',
    CanNotGet: false,
    ButtonText: "获取验证码",

    FullName: '',
    Mobile: '',
    MobileCode: '',
    PicCode: '',
    ImgCodeFullPath: '',
    Address: '',
    UserId: '',
    Fcode: '',
    IsFcode: true,
    openid: '',
    RedEnvelopeAreaInfoId: '',
    AddressIndex:0,
    ChooseAddress:false,
    Address:"请选择经销商"
  },

  GetImg: function () {
    var me = this;
    wx.request({
      url: 'https://hzcjwl.xyz/api/Code/GetPicValidateCode',
      method: 'GET',
      success: function (res) {
        if (res.data.Success) {
          me.setData({
            ImgCodeFullPath: res.data.Data
          })
        }
      }
    })
  },

  SetName: function (e) {
    this.setData({
      FullName: e.detail.value
    });
  },

  SetPhone: function (e) {
    this.setData({
      Mobile: e.detail.value
    });
  },

  SetPhoneCode: function (e) {
    this.setData({
      MobileCode: e.detail.value
    });
  },

  SetPicCode: function (e) {
    this.setData({
      PicCode: e.detail.value
    });
  },

  SetAddress: function (e) {
    console.log(this.data.TempShop);
    console.log(e.detail.value);
    this.setData({
      Address: this.data.AddressArray[e.detail.value],
      RedEnvelopeAreaInfoId: this.data.TempShop[e.detail.value].Id
    })
  },

  CountSeconds: function (e) {
    var sec = 60;
    var me = this;
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    // console.log(this);
    if (reg.test(this.data.Mobile)) {
      this.setData({
        CanNotGet: true
      })
      var timer = setInterval(function () {
        me.setData({
          ButtonText: sec + "秒后重新获取"
        });
        sec--;
        if (sec === 0) {
          clearInterval(timer);
          me.setData({
            CanNotGet: false,
            ButtonText: "获取验证码"
          })
        }
      }, 1000);
      wx.request({
        url: 'https://hzcjwl.xyz/api/Code/GetPhoneCode',
        method: 'GET',
        data: {
          phoneNum: me.data.Mobile
        },
        success: function (res) {
          console.log(res);
        }
      })
    } else {
      this.modal("请输入正确的手机号");
    }
  },

  modal: function (msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          // console.log('')
        }
      }
    })
  },

  Submit: function () {
    var me = this; 
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    console.log(this.data);
    if (this.data.FullName === "") {
      this.modal('请输入姓名');
    } else if (this.data.Mobile === "") {
      this.modal('手机号不能为空');
    } else if (!reg.test(this.data.Mobile)) {
      this.modal('手机号格式不合法');
    } else if (this.data.MobileCode === "") {
      this.modal('请输入手机验证码');
    } else if (this.data.PicCode === "") {
      this.modal('请输入图片验证码');
    } else if (this.data.Address === "请选择经销商"){
      this.modal('请选择经销商');
    } else {
      me.setData({
        submitObj:{
          FullName: me.data.FullName,
          Mobile: me.data.Mobile,
          MobileCode: me.data.MobileCode,
          PicCode: me.data.PicCode,
          RedEnvelopeAreaInfoId: me.data.RedEnvelopeAreaInfoId,
          ImgCodeFullPath: me.data.ImgCodeFullPath,
          Address: me.data.Address,
          UserId: me.data.UserId,
          Fcode: me.data.Fcode,
          IsFcode: me.data.IsFcode,
          openid: me.data.openid,
          Uniqueid: me.data.unionid,
          UserGameRecordid: me.data.UserGameRecordID,
          PhotoPath: me.data.CameraPhotoPath
        }
      });
      console.log(me.data.submitObj);
      wx.request({
        url: 'https://hzcjwl.xyz/SmallAppApi/Form',
        method: "POST",
        data: me.data.submitObj,
        success: function (res) {
          if (res.data.success) {
            wx.redirectTo({
              url: '../redpacket/redpacket?userRedEnvelopeRecordId=' + res.data.userRedEnvelopeRecordId
            })
          } else {
            if(res.data.reason){
              me.modal(res.data.reason);
            }else{
              me.modal(res.data.data);
            }
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    console.log(options);
    if (options.redEnvelopAreaInfoname){
      this.setData({
        ChooseAddress:true
      })
    } else{
      wx.request({
        url: "https://hzcjwl.xyz/SmallAppApi/GetRedEnvelopeArea",
        method: "POST",
        data: {
          companyid: 1                                             //opt.id!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!仅供测试要改
        },
        success: function (res) {
          // console.log(res);
          if (res.data.success) {
            var tmpArr = [];
            for(var i=0;i<res.data.data.length;i++){
              tmpArr.push(res.data.data[i].DealersCompannyName);
            }
            me.setData({
              AddressArray:tmpArr,
              TempShop:res.data.data
            })
          }
        }
      })
    }
    if (options.photopath) {
      this.setData({
        CameraPhotoPath: options.photopath
      })
    }
    this.GetImg();
    if (options.fcode){
      this.setData({
        Address: options.redEnvelopAreaInfoname,        
      })
      wx.request({
        url: 'https://hzcjwl.xyz/SmallAppApi/LogoffFcode',
        method: "POST",
        data: {
          freecode: options.fcode
        },
        success: function (res) {
          if (res.data.success) {
            console.log("注销成功");
          }
        }
      })
    }else{
      me.setData({
        IsFcode: false    
      })
    }
    this.setData({
      Fcode: options.fcode,
      RedEnvelopeAreaInfoId: options.redEnvelopAreaInfoid,
      UserId: options.userid,
      UserGameRecordID: options.UserGameRecordid
    });
    wx.login({                                                        //登录接口
      success: function (logincode) {
        var appid = 'wx87b0f6b5402d9800';
        var secret = '68fa3770c771f0937de80cb04fbcba31';
        me.setData({
          TempCode:logincode.code
        });
        wx.getUserInfo({
          success:function(res){
            wx.request({                                                     //获取openid接口
              url: 'https://hzcjwl.xyz/SmallAppApi/DecryptSmallApplicationUserInfo',
              method: 'POST',
              data: {
                appId: 'wx87b0f6b5402d9800',
                appSecret: '68fa3770c771f0937de80cb04fbcba31',
                code: me.data.TempCode,
                encryptedData: res.encryptedData,
                iv: res.iv,
                rawData: res.rawData,
                signature: res.signature
              },
              success: function (res) {
                // console.log(res);
                me.setData({
                  openid: res.data.data.openId,
                  unionid: res.data.data.unionId
                })
              }
            })
          }
        })
      }
    });
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