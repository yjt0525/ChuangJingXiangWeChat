Page({
  data: {
    circleList: [],//圆点数组
    awardList: [],//奖品数组
    colorCircleFirst: '#FFDF2F',//圆点颜色1
    colorCircleSecond: '#FE4D32',//圆点颜色2
    colorAwardDefault: '#F5F0FC',//奖品默认颜色
    colorAwardSelect: '#ffe400',//奖品选中颜色
    indexSelect: 0,//被选中的奖品index
    isRunning: false,//是否正在抽奖
    imageAward: [
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg',
      'img/gift0.jpg'
    ],//奖品图片数组
  },
  //开始游戏
  startGame: function () {
    console.log(this.data);
    var me = this;
    wx.request({
      url: "https://hzcjwl.xyz/SmallAppApi/LuckDraw",
      method:"POST",
      data:{
        openid:me.data.OpenId,
        unonid:me.data.UnionId,
        companyid:1
      },
      success:function(res){
        // console.log(res);
        // console.log(me.data)
        if(res.data.success){
          console.log(res);
          for(var i=0;i<me.data.LotteryList.length;i++){
            if (me.data.LotteryList[i].Id === res.data.jackpotViewModelId){
              me.setData({
                MyLottery: i,
                UserGameRecordID: res.data.userGameRecordid
              })
            }
          }
          me.GetLottery(me.data.MyLottery);
        }
      }
    })
  },

  GetLottery:function(id,userga){
    console.log(id);
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    var _this = this;
    var indexSelect = 0
    var i = 0;
    var lotterytittle = _this.data.LotteryList[id].JackGiftType===2?"很遗憾":"恭喜您";
    var lotterycontent = _this.data.LotteryList[id].JackGiftType === 2 ? "您没有中奖，谢谢参与" : "获得了" + (_this.data.LotteryList[id].JackGiftType === 0 ? _this.data.LotteryList[id].RedEnvelopeMoney+"元现金红包":"礼券")+",请到留资页面领取填写信息领取奖励";
    var timer = setInterval(function () {
      indexSelect++;
      //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
      i += 30;
      if (i > 1000 && (indexSelect % id == 0 || id==0)) {   //具体中哪个奖
        //去除循环
        clearInterval(timer)
        //获奖提示

        wx.showModal({
          title: lotterytittle,
          content: lotterycontent,
          showCancel: false,//去掉取消按钮
          success: function (res) {
            if (res.confirm) {
              _this.setData({
                isRunning: false
              });
              wx.redirectTo({
                url: '../form/form?UserGameRecordid=' + _this.data.UserGameRecordID,
              })
            }
          }
        })
      }
      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect
      })
    }, (100 + i))
  },

  renderLottery:function(){
    var _this =this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15;
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var imageAward = this.data.imageAward[j];
      var lottery = this.data.LotteryList[j];
      awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward, lottery: lottery });
    }
    this.setData({
      awardList: awardList
    })
  },

  onLoad: function () {
    var _this = this;
    wx.showLoading({
      title: '',
      mask:true
    })
    //获取ipenid unionid
    wx.login({
      success:function(res){
        _this.setData({
          TempCode:res.code
        });
        wx.getUserInfo({
          success: function (res) {
            wx.request({
              url: 'https://hzcjwl.xyz/SmallAppApi/DecryptSmallApplicationUserInfo',
              method: 'POST',
              data: {
                appId: 'wx87b0f6b5402d9800',
                appSecret: '68fa3770c771f0937de80cb04fbcba31',
                code: _this.data.TempCode,
                encryptedData: res.encryptedData,
                iv: res.iv,
                rawData: res.rawData,
                signature: res.signature
              },
              success: function (da) {
                _this.setData({
                  OpenId: da.data.data.openId,
                  UnionId: da.data.data.unionId
                });
                wx.request({
                  url: 'https://hzcjwl.xyz/SmallAppApi/SlyderAdventures',
                  method:"POST",
                  data:{
                    openid:_this.data.OpenId,
                    unionid:_this.data.UnionId,
                    companyid:1
                  },
                  success:function(res){
                    if(res.data.success){
                      // console.log(res);
                      _this.setData({
                        LotteryList: res.data.data.JackpotRecords
                      });
                      _this.renderLottery();
                      wx.hideLoading();
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
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