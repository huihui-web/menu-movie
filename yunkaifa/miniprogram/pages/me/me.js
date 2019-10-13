// miniprogram/pages/me/me.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    compassVal: 0,
    compassHidden: true,
    url: '',
    shakeInfo: {
      gravityModalHidden: true,
      num: 0,
      enabled: false
    },
    shakeData: {
      x: 0,
      y: 0,
      z: 0
    },
  },
  insert: function() {
    db.collection("user").add({
      data: {
        name: 'jerry',
        age: 20
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  update: function() {
    db.collection("user").doc("3b07eb945d04d83001e569d45b61561a").update({
      data: {
        age: 21
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  search: function() {
    db.collection("user").where({
      name: "jerry",
    }).get().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },
  remove: function() {
    db.collection("user").doc("3b07eb945d04d83001e569d45b61561a").remove().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },
  sum: function() {
    wx.cloud.callFunction({
      name: "sum",
      data: {
        a: 2,
        b: 3
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  getOpenId: function() {
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  batchDelete: function() {
    wx.cloud.callFunction({
      name: "batchDelete"
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  upload: function() {
    wx.chooseImage({
      success: function(res) {
        console.log(res.tempFilePaths)
        wx.cloud.uploadFile({
          cloudPath: "example.png",
          filePath: res.tempFilePaths[0],
          success: res => {
            console.log(res.fileID)
          },
          fail: err => {
            console.log(err)
          }
        })
      },
    })
  },
  download: function() {
    wx.cloud.downloadFile({
      fileID: "cloud://mysharing-351874.6d79-mysharing-351874/example.png",
      success: res => {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    })
  },
  //缓存清理
  clearCache: function() {
    wx.showModal({
      title: '缓存清理',
      content: '确定要清除本地缓存吗?',
      confirmColor: '#1f4ba5',
      cancelColor: '#7f8289',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'cooklist',
            success: function(res) {
              wx.showToast({
                title: '缓存清理成功',
                duration: 1000,
                mask: true,
                icon: "success"
              })
            },
          })
        }
      }
    });
  },
  //获取当前位置经纬度与当前速度
  getLonLat: function(callback) {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log(res)
        callback(res.longitude, res.latitude, res.speed);
      }
    });
  },
  //在地图上显示当前位置
  showMap: function() {
    this.getLonLat(function(lon, lat) {
      wx.openLocation({
        latitude: lat,
        longitude: lon,
        scale: 15,
        name: '广州大学华软软件学院',
        address: '广从南路548号',
        fail: function() {
          wx.showToast({
            title: '地图打开失败',
            duration: 1000,
            icon: "cancel"
          });
        }
      });
    });
  },
  //显示系统信息
  showSystemInfo: function() {
    wx.navigateTo({
      url: 'device/device',
    });
  },
  //网络状态
  showNetWork: function() {
    wx.getNetworkType({
      success: (res) => {
        var networkType = res.networkType
        wx.showModal({
          title: '网络状态',
          content: '您当前的网络：' + networkType,
        })
      }
    })
  },
  //显示罗盘
  showCompass: function() {
    this.setData({
      compassHidden: false
    })
    wx.onCompassChange((res) => {
      console.log(res)
      if (!this.data.compassHidden) {
        this.setData({
          compassVal: res.direction.toFixed(2)
        });
      }
    });
  },
  //隐藏罗盘
  hideCompass: function() {
    wx.stopCompass({
      success: (res) => {
        this.setData({
          compassHidden: true
        })
      }
    });
  },
  //摇一摇
  shake: function() {
    wx.cloud.getTempFileURL({
      fileList: ["cloud://mysharing-351874.6d79-mysharing-351874/shake.wav"]
    }).then((res) => {
      console.log(res.fileList[0].tempFileURL)
      this.data.url = res.fileList[0].tempFileURL;
    }).catch((err) => {
      console.log(err)
    })
    //启用摇一摇
    this.gravityModalConfirm(true);
    wx.onAccelerometerChange((res) => {
      //摇一摇核心代码，判断手机晃动幅度
      var x = res.x.toFixed(4),
        y = res.y.toFixed(4),
        z = res.z.toFixed(4);
      var flagX = this.getDelFlag(x, this.data.shakeData.x),
        flagY = this.getDelFlag(y, this.data.shakeData.y),
        flagZ = this.getDelFlag(z, this.data.shakeData.z);
      this.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4),
      };
      if (flagX && flagY || flagX && flagZ || flagY && flagZ) {
        //如果摇一摇幅度足够大，则认为摇一摇成功
        if (this.data.shakeInfo.enabled){
        this.data.shakeInfo.enabled = false;
        this.playShakeAudio();
        }
      }
    });
  },
  //启用或者停用摇一摇
  gravityModalConfirm: function(flag) {
    console.log("aaaa")
    if (flag !== true) {
      console.log("bbbb")
      wx.stopAccelerometer({
        success: (res) => {
          flag = false;
          this.setData({
            shakeInfo: {
              gravityModalHidden: true,
              num: 0,
              enabled: flag
            }
          })
        }
      })
    } else {
      this.setData({
        shakeInfo: {
          gravityModalHidden: !this.data.shakeInfo.gravityModalHidden,
          num: 0,
          enabled: flag
        }
      })
    }
  },
  //计算摇一摇的偏移量
  getDelFlag: function(val1, val2) {
    return (Math.abs(val1 - val2) >= 1);
  },
  //摇一摇成功后播放声音并累加摇一摇次数
  playShakeAudio: function() {
    wx.playBackgroundAudio({
      dataUrl: this.data.url,
      title: '',
      coverImgUrl: ''
    });
    wx.onBackgroundAudioStop(() => {
      this.data.shakeInfo.num++;
      this.setData({
        shakeInfo: {
          num: this.data.shakeInfo.num,
          enabled: true,
          gravityModalHidden: false
        }
      });
    });
  },
  //扫描二维码
  scanQRCode: function() {
    wx.scanCode({
      success: function(res) {
        console.log(res)
        wx.showModal({
          title: '扫描二维码',
          content: res.result,
        })
      },
      fail:function(res){
        wx.showModal({
          title: '扫描二维码',
          content: '扫描失败，请重试',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //获取用户信息
    wx.getUserInfo({
      success: function(res) {

        console.log(res);
        that.data.userInfo = res.userInfo;

        that.setData({
          userInfo: that.data.userInfo
        })
      }
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