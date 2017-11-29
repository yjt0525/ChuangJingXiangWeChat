// camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  OpenCamera:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        console.log(res);
        var tempFilePaths = res.tempFilePaths[0];//小程序产生的临时路径
        console.log(tempFilePaths);
        wx.uploadFile({ //上传文件的接口;
          url: 'https://hzcjwl.xyz/SmallAppApi/UpLoadFile', 
          filePath: tempFilePaths,
          name: 'file',
          // formData: {
          //   'user': 'test'
          // },
          success: function (obj) {
            //do something
            var mydata = JSON.parse(obj.data);
            console.log(obj);
            if(mydata.success){
              wx.navigateTo({
                url: '../form/form?photopath=' + mydata.path,
              });
            }else{
              
            }
          }
        });
      }
    })
  },

  UploadImg:function(){
    // wx.redirectTo({
    //   url: '../form/form',
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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