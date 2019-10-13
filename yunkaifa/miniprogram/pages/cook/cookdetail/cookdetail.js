// pages/cook/cookdetail/cookdetail.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },
  onMusicTap: function(e) {
    var that = this;
    if (this.data.isPlayingMusic) {
      backgroundAudioManager.pause();
      backgroundAudioManager.onPause(function() {
        that.setData({
          isPlayingMusic: !that.data.isPlayingMusic
        })
        app.globalData.g_isPlayingMusic=false;
      });
    } else {
      backgroundAudioManager.src = this.data.cook.music.url;
      backgroundAudioManager.title = this.data.cook.music.title;
      backgroundAudioManager.coverImgUrl = this.data.cook.music.coverImg;
      backgroundAudioManager.play();
      backgroundAudioManager.onPlay(function() {
        that.setData({
          isPlayingMusic: !that.data.isPlayingMusic
        })
      })
    app.globalData.g_isPlayingMusic=true;
    app.globalData.g_currentMusicCookId=this.data.cook.cookId;
    }
  },
  //监听音乐播放完毕，将音乐图标恢复为未播放状态
  setMusicMonitor: function() {
    backgroundAudioManager.onEnded(() => {
      this.setData({
        isPlayingMusic: !this.data.isPlayingMusic
      })
      app.globalData.g_isPlayingMusic=false;
    })
  },
  initMusicStatus(){
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicCookId == this.data.cook.cookId){
      this.setData({
        // isPlayingMusic:app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicCookId==this.data.cook.cookId
        isPlayingMusic:true
      })
    }else{
      this.setData({
        isPlayingMusic: false
      })
    }
    // this.setData({
    //   isPlayingMusic:app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicCookId==this.data.cook.cookId
    // })
  },
  onCommentTap: function(e) {
    var id = e.currentTarget.dataset.cookId;
    wx.navigateTo({
      url: '../cookcomment/cookcomment?id=' + id
    })
  },
  onCollectionTap: function(e) {
    var id = e.currentTarget.dataset.cookId;
    var cooklist = wx.getStorageSync("cooklist");
    var cookdetail = cooklist[id - 1];
    if (cookdetail.collectionStatus) {
      cookdetail.collectionNum--;
      cookdetail.collectionStatus = false;
    } else {
      cookdetail.collectionNum++;
      cookdetail.collectionStatus = true;
    }
    this.setData({
      "cook.collectionStatus": cookdetail.collectionStatus,
      "cook.collectionNum": cookdetail.collectionNum,
    })
    wx.showToast({
      title: cookdetail.collectionStatus ? "收藏成功" : "取消收藏",
    })
    cooklist[id - 1] = cookdetail;
    wx.setStorageSync("cooklist", cooklist);
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.onLoad();
    }
  },
  //定义动画
  setAnimation:function(){
    var animationUp=wx.createAnimation({
      duration:4000,
      timingFunction:'ease-in-out',
      delay:0,
      transformOrigin:'50% 50% 0'
    })
    this.animationUp=animationUp;
  },
  onUpTap: function(e) {
    var id = e.currentTarget.dataset.cookId;
    var cooklist = wx.getStorageSync("cooklist");
    var cookdetail = cooklist[id - 1];
    if (cookdetail.upStatus) {
      cookdetail.upNum--;
      cookdetail.upStatus = false;
    } else {
      cookdetail.upNum++;
      cookdetail.upStatus = true;
    }
    this.setData({
      "cook.upStatus": cookdetail.upStatus,
      "cook.upNum": cookdetail.upNum,
    })
    //设置动画
    this.animationUp.scale(2).step();
    //导出动画数据传递给组件的animation属性
    this.setData({
      animationUp:this.animationUp.export()
    })
    setTimeout(function(){
      this.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this),3000)
    wx.showToast({
      title: cookdetail.upStatus ? "点赞成功" : "取消点赞",
    })
    cooklist[id - 1] = cookdetail;
    wx.setStorageSync("cooklist", cooklist);
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.onLoad();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var cooklist = wx.getStorageSync("cooklist");
    var cookdetail = cooklist[id - 1];
    this.setData({
      cook: cookdetail
    });
    wx.setNavigationBarTitle({
      title: cookdetail.title,
    });
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAnimation();
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