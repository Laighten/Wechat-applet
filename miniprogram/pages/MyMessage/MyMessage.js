const app = getApp()
var that
const db = wx.cloud.database();
var userOpenId = ''


Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount1: 0,
    totalCount2: 0,
    totalCount3: 0,
    topics: {},
    waitAdds:{},
    historyMsg:{},
    denys:{},
    showIndex1: 0,
    showIndex2: 0,
    showIndex3: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getData(that.data.page);
  },

  panel1: function (e) {

    if (e.currentTarget.dataset.index != this.data.showIndex1) {
      this.setData({
        showIndex1: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex1: 0,
        
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
        showIndex2: 0,
      })
    }
  },
  panel3: function (e) {
    if (e.currentTarget.dataset.index != this.data.showIndex3) {
      this.setData({
        showIndex3: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex3: 0,
      })
    }
  },


  /**
   * 获取待发布列表数据
   * 
   */
  getData:async function (page) {
    await wx.cloud.callFunction({
      name:'login',
    }).then(res => {
      userOpenId = res.result.openid
    })

    // 获取待发布总数
    db.collection('waitAdd').count({
      success: function (res) {
        that.data.totalCount1 = res.total;
      }
    })
    
    // 获取前十条
    try {
      db.collection('waitAdd')
        .where({
          _openid: userOpenId, // 填入当前用户 openid
        })
        .orderBy('date', 'desc')
        .get({
          success: function (res) {    
            that.data.waitAdds = res.data;
            that.setData({
              waitAdds: that.data.waitAdds,
            });
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

    // 获取已发布总数
    db.collection('topic').count({
      success: function (res) {
        that.data.totalCount2 = res.total;
      }
    })
    // 获取前十条
    try {
      db.collection('topic')
        .where({
         publisherID: userOpenId, // 填入当前用户 openid
        })
        // .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.topics = res.data;
            that.setData({
              topics: that.data.topics,
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

    // 获取未发布总数
    db.collection('deny').count({
      success: function (res) {
        that.data.totalCount3 = res.total;
      }
    })
    // 获取前十条
    try {
      db.collection('deny')
        .where({
          publisherID: userOpenId, // 填入当前用户 openid
        })
        // .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.denys = res.data;
            that.setData({
              denys: that.data.denys,
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


  /**
   * item 点击
   */
  // onItemClick: function (event) {
  //   var id = event.currentTarget.dataset.topicid;
  //   //console.log(id);
  //   wx.navigateTo({
  //     url: "../homeDetail/homeDetail?id=" + id
  //   })
  // },
  delOneH: function (event) {
    var id = event.currentTarget.dataset.topicid;
    wx.cloud.callFunction({
      name: 'deleteOne',
      data: {
        _id: id,
        num: 2
      }
    }).then(console.log);
    wx.showToast({
      title: '删除成功，刷新试试~~',
      icon: 'none',
      duration: 1500
    })
    that.onLoad()
  },
  delTwoH:function(event){
    var id = event.currentTarget.dataset.topicid;
    wx.cloud.callFunction({
      name: 'deleteOne',
      data: {
        _id: id,
        num: 3
      }
    }).then(console.log);
    wx.showToast({
      title: '删除成功，刷新试试~~',
      icon: 'none',
      duration: 1500
    })
    that.onLoad()
  },
  
  reWrite:function(event){
    var id = event.currentTarget.dataset.topicid;
    app.globalData.idl = id
    wx.navigateTo({
      url: "RePublish/republish"
    })
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
    if (that.data.topics.length < that.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('topic')
          .where({
            _openid: app.globalData.openid, // 填入当前用户 openid
          })
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 10 条
          .orderBy('date', 'desc')
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  console.log(tempTopic);
                  temp.push(tempTopic);
                }

                var totalTopic = {};
                totalTopic = that.data.topics.concat(temp);

                console.log(totalTopic);
                that.setData({
                  topics: totalTopic,
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

  },

})