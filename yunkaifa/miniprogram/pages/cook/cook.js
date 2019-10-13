// pages/cook/cook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // info:{
    // title:"母亲节专属炒饭",
    // img: "/images/cookbook/pic-1.jpg"}
  },
  onTapToDetail: function(event) {
    var cookId = event.currentTarget.dataset.cookId;
    var cooklist = wx.getStorageSync("cooklist");
    var cookdetail = cooklist[cookId - 1];
    cookdetail.readingNum++;
    cooklist[cookId - 1] = cookdetail;
    wx.setStorageSync("cooklist", cooklist)
    this.setData({
      cooklist: cooklist
    })
    wx.navigateTo({
      url: "cookdetail/cookdetail?id=" + cookId
    })
  },
  onSwiperTap: function(event) {
    var cookId = event.target.dataset.cookId;
    wx.navigateTo({
      url: 'cookdetail/cookdetail?id=' + cookId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cooklist = wx.getStorageSync('cooklist')
    this.setData({
      cooklist: cooklist,
    });
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