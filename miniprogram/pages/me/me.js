// miniprogram/pages/me/me.js
const db = wx.cloud.database(); //初始化数据库
var app = getApp();
Page({

  actioncnt: function () {

    wx.showActionSheet({
      itemList: ['群聊', '好友', '朋友圈'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: 0,
    isSuperAdmin: null,
    messageNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      isSuperAdmin: app.globalData.superAdmin
    })
    db.collection('commentSecond')
      .where({
        u_id: app.globalData.openid,
        readState: 0
      }).count({
        success: function (res) {
          //console.log(res.total)
          if (res.total != 0) {
            that.setData({
              messageNum: res.total
            });
          }
        }
      })
    //console.log(app.globalData.superAdmin)
    //查看是否为管理员
    db.collection('admin').where({
      _openid: app.globalData.openid,
    })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组

          that.setData({
            isAdmin: res.data[0].state
          });
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
        }
      })
  },
  /**
   * 收藏列表
   */
  onCollectClick: function (event) {
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  /**
   * 我的消息
   */
  onMessageClick: function (event) {
    wx.navigateTo({
      url: './message/message',
    })
  },
  /*
  管理员界面
  */
  onAdminClick: function (event) {
    wx.navigateTo({
      url: '../Admin/Admin',
    })
  },
  /*
  跳转到申请管理员界面
  */
  applyAdminClick: function (event) {
    //查看是否已申请
    db.collection('admin').where({
      _openid: app.globalData.openid,
    })
      .get({
        success: function (res) {
          // console.log(res.data.length == 0)
          // console.log(typeof(res.data.length))
          //console.log(res.data[0].state)
          if (res.data.length == 0) {
            console.log('res.data.length')
            wx.navigateTo({
              url: '../applyAdmin/applyAdmin?info=' + ' ',
            })
          }
          else if (res.data[0].state == -1) {
            var items = JSON.stringify(res.data[0]);
            wx.navigateTo({
              url: '../applyAdmin/applyAdmin?info=' + items,
            })
            console.log(items)
          }
          else {
            wx.showToast({
              title: '申请待审核，请勿重复提交哦~',
              icon: 'none'
            })
          }
          //if(res)

        }
      })

  },
  /* 审核管理员*/
  checkAdminClick: function () {
    wx.navigateTo({
      url: 'checkAdmin/checkAdmin',
    })
  },
  /**
   * 提交意见
   */
  onAdvanceClick: function (event) {
    wx.navigateTo({
      url: '../advance/advance',
    })
  },


  clickInvitivation: function (event) {
    this.actioncnt();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
  }

})
