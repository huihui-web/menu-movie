// pages/denglu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    winWidth:0,
    winHeight:0
  },
  accountinput: function(e) {
    console.log(e.detail.value)
  },
  getUserInfo: function(e) {
    console.log(e.detail.userInfo);
    app.globalData.userInfo=e.detail.userInfo;
    console.log(app.globalData.userInfo);
    wx.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 2000,
        success: function() {
          wx.switchTab({
            url: '../me/me',
          })
        }
    })
  },
  formSumbit:function(e){
    var user=new Object();
    user.userName=e.detail.value.mynick;
    user.city=e.detail.value.onoff;
    app.globalData.userInfo=user;
    wx.showToast({
      title: '注册成功',
      icon:'success',
      duration:2000,
      success:function(){
        wx.switchTab({
          url: '../me/me',
        })
      }
    })
  },
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function(options) {
var page=this;
wx.getSystemInfo({
  success: function(res) {
    console.log(res);
    page.setData({winWidth:res.windowWidth});
    page.setData({winHeight:res.windowHeight});
  }
})
},
switchNav:function(e){
  var page=this;
  if(this.data.currentTab==e.target.dataset.current){
    return false;
  }else{
    page.setData({currentTab:e.target.dataset.current});
  }
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function() {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function() {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function() {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function() {

}
})