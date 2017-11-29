// map.js

var map = require('libs/amap-wx.js');
var amap;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ShowShopDetail: false,
    TaskImg: 'http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/map/task.png',
    LogoImg: 'http://business.bim-u.com/WeChatSmallApplication/RedPacketImg/map/logo.png',
    ShowMap: 'block',
    markers: [],
    tempmarkers: [],
    ShopName: '',
    ShopPhone: '',
    ShopAddress: '',
    TempLat: 0,
    TempLng: 0,
    polyline: [], 
    RouteLists:[],
    ShowRoutes:false
  },

  TabRedPocket: function (e) {
    // console.log(e.markerId);
    this.SetInfo(e.markerId);
  },

  CloseDetail: function () {
    this.setData({
      ShowShopDetail: false,
      ShowMap: "block"
    })
  },

  CloseRoutes:function(){
    this.setData({
      ShowShopDetail: false,
      ShowMap: "block",
      ShowRoutes:false
    })
  },

  GoHere: function () {
    var me = this;
    console.log(this.data.TempLat, this.data.TempLng, this.data.mylat, this.data.mylng);
    this.setData({
      ShowShopDetail: false,
      ShowMap: "block",
    });
    amap.getDrivingRoute({
      origin: me.data.mylng + ',' + me.data.mylat,
      destination: me.data.TempLng + ',' + me.data.TempLat,
      success: function (data) {
        me.ShowRoutes(data.paths[0].steps);
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        me.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
      }
    })
  },

  ShowRoutes:function(obj){
    this.setData({
      ShowShopDetail:false,
      ShowMap:"none",
      ShowRoutes:true,
      RouteLists:obj
    });
    // console.log(this.data.RouteLists);
  },

  SetInfo: function (id) {
    var pockets = this.data.ShopLists;
    for (var i = 0; i < pockets.length; i++) {
      if (pockets[i].Id === id) {
        console.log(pockets[i]);
        this.setData({
          ShowShopDetail: true,
          ShowMap: 'none',
          CompanyName: pockets[i].DealersCompannyName,
          ShopPhone: pockets[i].SalesHotline,
          ShopAddress: pockets[i].SalesAddress,
          TempLat: pockets[i].Dimension,
          TempLng: pockets[i].Longitude
        });
        break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var me = this;
    amap = new map.AMapWX({ key: 'f38b64cc0afcf08d6cddc887301802d5' });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        me.setData({
          mylat: res.latitude,
          mylng: res.longitude
        })
      }
    });
    wx.request({
      url: "https://hzcjwl.xyz/SmallAppApi/GetRedEnvelopeArea",
      method: "POST",
      data: {
        companyid: 1                                             //opt.id!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!仅供测试要改
      },
      success: function (res) {
        // console.log(res);
        if (res.data.success) {
          me.setData({
            ShopLists: res.data.data
          })
          for (var i = 0; i < res.data.data.length; i++) {
            me.data.tempmarkers.push({
              iconPath: "img/redpocket.png",
              id: res.data.data[i].Id,
              latitude: res.data.data[i].Dimension,
              longitude: res.data.data[i].Longitude
            });
          }
          // console.log(me.data.tempmarkers);
        }
        me.setData({
          markers: me.data.tempmarkers
        })
        // console.log(me.data.markers);
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