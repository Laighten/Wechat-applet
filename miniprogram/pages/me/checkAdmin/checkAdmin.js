// miniprogram/pages/me/checkAdmin/checkAdmin.js
var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIndex0: 0,
    showIndex1: 0,
    showIndex2: 0,
    page: 0,
    pageSize: 5,
    totalCount0: 0,
    totalCount1: 0,
    totalCount2: 0,
    adminWait:{},
    adminAccess: {},
    adminNoAccess:{}
  },
  /* 
  通过申请
  */
  access:function(event){
    //审核通过，调用云函数进行修改
    wx.cloud.callFunction({
      name: 'updateAdmin',
      data: {
        id: event.target.dataset.adminid,
        state: 1
      }
    }).then(res => {
      
      if(res.result.stats.updated>0){
        wx.showToast({
          title: '审核通过',
        })
        this.onLoad()
      }
      else{
        wx.showToast({
          title: '出现问题，请稍后再试~~',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
    })
    
  },
  /*
  *不通过申请
  */
  notAccess:function(event){
    //审核未通过，调用云函数进行修改
    wx.cloud.callFunction({
      name: 'updateAdmin',
      data: {
        id: event.target.dataset.adminid,
        state:-1
      }
    }).then(res => {

      if (res.result.stats.updated > 0) {
        wx.showToast({
          title: '审核不通过',
        })
        this.onLoad()
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
  /**
   * 获取数据
   */
  getData: function (page) {
    /**************获取待审核人员******************* */
    // 获取总数
    db.collection('admin')
    .where({
      state:0
    })
    .count({
      success: function (res) {
        that.data.totalCount0 = res.total;
      }
    })
    // 获取前十条
    try {
      db.collection('admin')
        .where({state: 0})
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.adminWait = res.data;
            that.setData({
              adminWait: that.data.adminWait,
            })
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
    /**************获取未通过审核人员******************* */
    // 获取总数
    db.collection('admin')
      .where({
        state: -1
      })
      .count({
        success: function (res) {
          that.data.totalCount1 = res.total;
        }
      })
    // 获取前十条
    try {
      db.collection('admin')
        .where({ state: -1 })
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.adminNoAccess = res.data;
            that.setData({
              adminNoAccess: that.data.adminNoAccess,
            })
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
    /**************获取通过审核人员******************* */
    // 获取总数
    db.collection('admin')
      .where({
        state: 1
      })
      .count({
        success: function (res) {
          that.data.totalCount2 = res.total;
          
        }
      })
    // 获取前十条
    try {
      db.collection('admin')
        .where({ state: 1 })
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.adminAccess = res.data;
            that.setData({
              adminAccess: that.data.adminAccess,
            })
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
  panel0: function (e) {
   
    if (e.currentTarget.dataset.index != this.data.showIndex0) {
      this.setData({
        showIndex0: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex0: 0
      })
    }
  },
  panel1:function(e){
    if (e.currentTarget.dataset.index != this.data.showIndex1) {
      this.setData({
        showIndex1: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex1: 0
      })
    }
  },
  panel2: function (e) {
    if (e.currentTarget.dataset.index != this.data.showIndex2) {
      this.setData({
        showIndex2: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex2: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    that = this
    that.getData(that.data.page);
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //console.log('pulldown');
    that.getData(that.data.page);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var temp = [];
    // 获取后面十条
    if (that.data.adminWait.length < that.data.totalCount0) {
      try {
        const db = wx.cloud.database();
        db.collection('admin')
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 10 条
          .orderBy('name', 'desc')
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  //console.log(tempTopic);
                  temp.push(tempTopic);
                }
                var totalWait = {};
                totalWait = that.data.adminWait.concat(temp);
                //console.log(totalTopic);
                that.setData({
                  adminWait: totalWait,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }
            },
          })
      } catch (e) {
        console.error(e);
      }
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