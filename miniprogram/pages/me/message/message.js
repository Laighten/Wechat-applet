// miniprogram/pages/me/message/message.js
var app = getApp();
var that
const db = wx.cloud.database(); //初始化数据库
var userOpenId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 10,
    totalCount0: 0,
    totalCount1: 0,
    unReadMessage:{},
    ReadedMessage: {},

    TabCur: 0,
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getData(that.data.page);
  },
  /*
  *全部标记已读按钮
   */
  allReadClick:function(event){
    wx.cloud.callFunction({
      name: 'updateAllMessage',
      data: {
        u_id: userOpenId
      }
    }).then(res => {
      console.log(res)
      if (res.result.stats.updated > 0) {
        wx.showToast({
          title: '标记成功',
        })
        that.onLoad()
      }
      else {
        wx.showToast({
          title: '没有最新的未读消息哦~',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onReadClick0:function(event){
    var id = event.currentTarget.dataset.topicid;
    var openid = userOpenId;
    var secondCommentId = event.currentTarget.dataset.id;
    
    wx.cloud.callFunction({
      name: 'updateMessageState',
      data: {
        id: secondCommentId
      }
    }).then(res => {
      //console.log(res)
      if (res.result.stats.updated > 0) {
        wx.navigateTo({
          url: "../../homeDetail/homeDetail?id=" + id + "&openid=" + openid,
        })
        that.onLoad()
      }
      else {
        wx.showToast({
          title: '出现问题，请稍后再试~~',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
    })
    
  },
  onReadClick1: function (event) {
    var id = event.currentTarget.dataset.topicid;
    var openid = userOpenId;

    wx.navigateTo({
      url: "../../homeDetail/homeDetail?id=" + id + "&openid=" + openid,
    })

  },
  /**
     * 获取当前用户消息
     * 
     */
  getData:async function (page) {
    
    await wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      userOpenId = res.result.openid
    })
    //console.log(userOpenId)
    // 获取未读消息总数
    db.collection('commentSecond')
    .where({
      u_id: userOpenId,
      readState:0
    }).count({
      success: function (res) {
        that.data.totalCount0 = res.total;
      }
    })

    // 获取前十条
    try {
      db.collection('commentSecond')
        .where({
          u_id: userOpenId, // 填入当前用户 openid
          readState: 0
        })
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.unReadMessage = res.data;
            that.setData({
              unReadMessage: that.data.unReadMessage,
            });
            //console.log(that.data.unReadMessage)
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
    // 获取已读消息总数
    db.collection('commentSecond')
      .where({
        u_id: userOpenId,
        readState: 1
      }).count({
        success: function (res) {
          that.data.totalCount1 = res.total;
        }
      })

    // 获取前十条
    try {
      db.collection('commentSecond')
        .where({
          u_id: userOpenId, // 填入当前用户 openid
          readState: 1
        })
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.ReadedMessage = res.data;
            that.setData({
              ReadedMessage: that.data.ReadedMessage,
            });
            //console.log(that.data.ReadedMessage)
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
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
    this.onLoad()
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var temp = [];
    var temp1 = [];
    // *****************获取未读消息后面十条*************************
    if (this.data.TabCur == 0 && this.data.unReadMessage.length < this.data.totalCount0) {
      db.collection('commentSecond')
      .where({
        u_id: userOpenId, // 填入当前用户 openid
        readState: 0
      })
      .orderBy('date', 'desc')
      .skip(this.data.unReadMessage.length)
      .limit(that.data.pageSize) // 限制返回数量为 10 条
      .get({
        success: function (res) {
          wx.showLoading({
            title: '加载中',
          })
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempunReadMessage = res.data[i];
              temp.push(tempunReadMessage);
            }
            var totalUnRead = {};
            totalUnRead = that.data.unReadMessage.concat(temp);
            that.setData({
              unReadMessage: totalUnRead,
            })
            wx.hideLoading()
          } else {
            wx.showToast({
              title: '没有更多数据了',
            })
          }
        },
      })
    }// *****************获取已读消息后面十条******************/
    else if (this.data.TabCur == 1 && this.data.ReadedMessage.length < this.data.totalCount1 ) {
      db.collection('commentSecond')
        .where({
          u_id: userOpenId, // 填入当前用户 openid
          readState: 1
        })
        .orderBy('date', 'desc')
        .skip(this.data.ReadedMessage.length)
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .get({
          success: function (res) {
            wx.showLoading({
              title: '加载中',
            })
            //console.log(res.data.length)
            // res.data 是包含以上定义的两条记录的数组
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var tempReadedMessage = res.data[i];
                temp1.push(tempReadedMessage);
              }
              var totalReaded = {};
              totalReaded = that.data.ReadedMessage.concat(temp1);
              that.setData({
                ReadedMessage: totalReaded,
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: '没有更多数据了',
              })
            }
          },
        })
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})