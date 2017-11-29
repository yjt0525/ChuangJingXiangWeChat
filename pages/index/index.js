//index.js
//获取应用实例
var app = getApp();
var maplib = require('libs/amap-wx.js');
var amap;
var QQMapWX = require('libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    ShowImgCover: true,
    ShowLoadingCover: false,
    StaticImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/static.png",
    BgImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/bg.png",
    LogoImg: "http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/index/logo.png",
    LoadingWidth: 0,
    FindObj: {}
  },

  //事件处理函数
  loading: function (me) {                    //开始加载  加载完后  然后跳转
    me.setData({
      ShowLoadingCover: true,
      LoadingWidth: 0
    });
    var timer = setInterval(function () {
      me.setData({
        LoadingWidth: me.data.LoadingWidth + 1
      });
      if (me.data.LoadingWidth > 100) {
        clearInterval(timer);
        console.log("找到的经销商为：",me.data.areainfo);
        console.log(me.data.mylat, me.data.mylng);
        console.log("游戏类型为：",me.data.gametype);
        console.log("lbs为：",me.data.islbs);
        if ((me.data.islbs && me.data.areainfo) || (!me.data.islbs)){
          if (me.data.gametype==0){
            wx.navigateTo({
              url: '../scancode/scancode',
            })
          } else if (me.data.gametype==1){
            wx.navigateTo({
              url: '../camera/camera',
            })
          } else if (me.data.gametype==2){
            wx.navigateTo({
              url: '../wheel/wheel',
            })
          }
        }else{
          wx.navigateTo({
            url: '../map/map'
          })
        }
      }
    }, 30)
  },

  //获取所有红包
  // GetRedPacketInfo:function(){
  //   var me = this;
  //   qqmapsdk.reverseGeocoder({
  //     location: {
  //       latitude:me.data.mylat,
  //       longitude:me.data.mylng
  //     },
  //     success: function (res) {
  //       var myprovince = res.result.address_component.province.replace((res.result.address_component.province.match("省") || res.result.address_component.province.match("市"))[0],"");
  //       var mycity = res.result.address_component.city.replace((res.result.address_component.city.match("省") || res.result.address_component.city.match("市"))[0], "");
  //       wx.request({
  //         url: 'https://hzcjwl.xyz/SmallAppApi/GetCityRedEnvelopeArea',
  //         method:"GET",
  //         data:{
  //           companyid:me.data.companyid,
  //           openid:me.data.openid,
  //           province: myprovince, 
  //           city:mycity
  //         },
  //         success:function(res){
  //           if(res.data.success){
  //             me.JudgeDistance(res.data.data);
  //           }
  //         }
  //       })
  //     }
  //   });
  // },

  // JudgeDistance:function(obj){
  //   var me = this
  //   for(let i=0;i<obj.length;i++){
  //     amap.getDrivingRoute({
  //       origin:me.data.mylng+','+me.data.mylat,
  //       destination:obj[i].Longitude+','+obj[i].Dimension,
  //       success:function(res){
  //         console.log(res.paths[0].distance);
  //         if (res.paths[0].distance < 5000){
  //           me.setData({
  //             FindObj:obj[i]
  //           })
  //         }
  //       }
  //     })
  //   }
  // },

  //页面加载完成执行事件
  onLoad: function (opt) {
    var me = this;
    me.setData({
      LoadingWidth:0
    })
    amap = new maplib.AMapWX({ key: 'f38b64cc0afcf08d6cddc887301802d5' });   //1.初始化高德地图
    qqmapsdk = new QQMapWX({                                                 //2.初始化高德地图
      key: 'AU7BZ-EWKWW-LW7R3-OBNQX-YTVQ3-EVBSI'
    });
    wx.getLocation({                                                         //3.获取当前位置  并且缓存mylat mylng
      type: 'gcj02',
      success: function (res) {
        me.setData({
          mylat: res.latitude,
          mylng: res.longitude,
          companyid: 1
        });
        wx.login({                                                        //登录接口
          success: function (logincode) {
            me.setData({
              TempCode: logincode.code
            })
            wx.getUserInfo({
              success: function (res) {
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
                    console.log(res);
                    wx.request({                                                    //openid和compangid获取图片链接
                      url: "https://hzcjwl.xyz/SmallAppApi/Index",
                      data: {
                        id: 1,                                                      //opt.id!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!仅供测试要改
                        openid: res.data.data.unionId,
                        lat: me.data.mylat,
                        lng: me.data.mylng
                      },
                      method: "POST",
                      success: function (res) {
                        // console.log(res);
                        me.setData({
                          activityid: res.data.ActivityRecordid,
                          areainfo: res.data.redEnvelopeAreaInfo,
                          gametype: res.data.ActivityRecordtype,
                          islbs: res.data.islbs
                        })
                        if (!res.data.success) {
                          console.log(res);
                          wx.redirectTo({                                            //失败跳转到提示页
                            url: '../message/message?msg=' + res.data.reason + '&redmoney=' + res.data.redmoney + '&giftid=' + res.data.giftid + '&giftintroduct=' + res.data.giftintroduct + '&giftpwd=' + res.data.giftpwd
                          })
                        } else {
                          // me.GetRedPacketInfo();                                                                     //成功则开始加载
                          me.loading(me);
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })

      }
    });
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
