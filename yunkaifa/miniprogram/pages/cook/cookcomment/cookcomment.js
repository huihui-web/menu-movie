// pages/cook/cookcomment/cookcomment.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useKeyboardFlag: true,
    sendMoreMsgFlag: false,
    keyboardInputValue: '',
    audio: {
      url: null,
      timeLen: 0
    },
    currentAudio: '',
    chooseFiles: [],
    deleteIndex: -1,
  },
  //获取用户输入
  bindCommentInput: function(event) {
    var val = event.detail.value;
    this.data.keyboardInputValue = val;
  },
  //提交用户评论
  submitComment: function(event) {
    var imgs = this.data.chooseFiles;
    var audio = this.data.audio;
    var newData = {
      username: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl,
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img: imgs,
        audio: audio
      },
    };
    if (!newData.content.txt && imgs.length == 0 && !audio) {
      //如果没有评论内容，就不执行任何操作
      return;
    }
    //保存新评论到缓存数据库
    var cooklist = wx.getStorageSync('cooklist');
    var comments = cooklist[this.data.cookId - 1].comments;
    comments[comments.length] = newData;
    cooklist[this.data.cookId - 1].commentNum++;
    cooklist[this.data.cookId - 1].comments = comments;
    wx.setStorageSync('cooklist', cooklist);
    //显示操作结果
    this.showCommitSuccessToast();
    //更新渲染并绑定所有评论
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false,
      audio: {
        url: null,
        timeLen: 0
      },
    })
    //刷新页面
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var that = this;
      var curPage = pages[pages.length - 1];
      var prePage = pages[pages.length - 2];
      var preprePage = pages[pages.length - 3];
      curPage.onLoad({
        id: that.data.cookId
      });
      prePage.onLoad({
        id: that.data.cookId
      });
      preprePage.onLoad();
    }
  },
  showCommitSuccessToast: function() {
    //显示操作结果
    wx.showToast({
      title: '评论成功',
      duration: 1000,
      icon: 'success'
    })
  },
  //开始录音
  recordStart: function(e) {
    var that = this;
    this.setData({
      recodingClass: 'recoding'
    });
    //记录录音开始时间
    // this.startTime = new Date();
    var startTime=e.timeStamp;
    wx.startRecord({
      success: function(res) {
        //计算录音时长
        var diff = (that.endTime - that.startTime) / 1000;
        diff = Math.ceil(diff);
        //发送录音
        that.data.audio.url = res.tempFilePath;
        that.data.audio.timeLen = diff;
        that.submitComment();
      },
      fail: function(res) {
        console.log(res);
        console.log('fail');
      },
      complete: function(res) {
        console.log(res);
        console.log('complete');
      }
    })
  },
  //结束录音
  recordEnd: function(e) {
    this.setData({
      recodingClass: '',
      endTime:e.timeStamp
    });
    // this.endTime = new Date();
    wx.stopRecord();
  },
  //语音消息的暂停与播放
  playAudio: function(event) {
    var url = event.currentTarget.dataset.url,
      that = this;
    //暂停当前录音播放
    if (url == this.data.currentAudio) {
      wx.pauseVoice();
      this.data.currentAudio = '';
    }
    //播放录音
    else {
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        complete: function() {
          that.data.currentAudio = '';
        },
      });
    }
  },
  sendMoreMsg: function() {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },
  switchInputType: function(event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },
  //预览图片
  previewImg: function(event) {
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
      //获取图片在图片数组中的序号
      imgIdx = event.currentTarget.dataset.imgIdx,
      //获取评论的全部图片
      imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], //当前显示图片的HTTP链接
      urls: imgs //需要预览的图片HTTP链接列表
    })
  },
  dateFormat: function(comments) {
    var temp;
    for (var j = comments.length - 1; j > 0; j--) {
      for (var i = 0; i < j; i++) {
        if (comments[i].create_time < comments[i + 1].create_time) {
          temp = comments[i + 1];
          comments[i + 1] = comments[i];
          comments[i] = temp;
        }
      }
    }
    for (var i = 0; i < comments.length; i++) {
      comments[i].create_time = util.formatTime(comments[i].create_time, true);
    }
    return comments
  },

  //选择本地照片与拍照
  chooseImage: function(event) {
    var imgArr = this.data.chooseFiles;
    var leftCount = 3 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    wx.chooseImage({
      count : leftCount,
      sourceType: sourceType,
      success: function(res) {
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      },
    })
  },
  //删除已选择照片
  deleteImage: function(event) {
    var index = event.currentTarget.dataset.idx;
    var that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function() {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      });
    }, 500);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var cooklist = wx.getStorageSync("cooklist");
    var comments = cooklist[id - 1].comments;
     comments=this.dateFormat(comments);
    this.setData({
      comments: comments,
      cookId: id,
    })
    wx.setNavigationBarTitle({
      title: cooklist[id - 1].title,
    })
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