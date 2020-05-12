var that
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    totalCount: 0,
    topics: {},
    addr:'' ,
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
   // that.jugdeUserLogin()
    //that.getAddress()
    that.getPermission()
    //console.log(that.data.address)
    //console.log('1111'+that.getAddress())
    wx.cloud.init({
      env: app.globalData.evn
    })
  },

  onShow: function() {
    that.getData();
  },
  /**
   * 获取列表数据
   * 
   */
  // getAddress:function(){
  //   var that=this;
  //   that.getPermission();    //传入that值可以在app.js页面直接设置内容    
    
  // }, 
  //获取用户地理位置权限
  getPermission: function(){
    //var address = ''
    wx.chooseLocation ({
      success: function (res) {    
        that.data.address = res.address  
          that.setData({
              addr: res.address      //调用成功直接设置地址
          })              
      },
      fail:function(){
          wx.getSetting({
              success: function (res) {
                  var statu = res.authSetting;
                  if (!statu['scope.userLocation']) {
                      wx.showModal({
                          title: '是否授权当前位置',
                          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                          success: function (tip) {
                              if (tip.confirm) {
                                  wx.openSetting({
                                      success: function (data) {
                                          if (data.authSetting["scope.userLocation"] === true) {
                                              wx.showToast({
                                                  title: '授权成功',
                                                  icon: 'success',
                                                  duration: 1000
                                              })
                                              //授权成功之后，再调用chooseLocation选择地方
                                              wx.chooseLocation({
                                                  success: function(res) {
                                                    //return  res.address 
                                                    that.data.address = res.address
                                                      obj.setData({
                                                          addr: res.address
                                                      })
                                                         
                                                      
                                                  },
                                              })
                                          } else {
                                              wx.showToast({
                                                  title: '授权失败',
                                                  icon: 'success',
                                                  duration: 1000
                                              })
                                          }
                                      }
                                  })
                              }
                          }
                      })
                  }
              },
              fail: function (res) {
                  wx.showToast({
                      title: '调用授权窗口失败',
                      icon: 'success',
                      duration: 1000
                  })
              }
          })
      }
  })        
 },
  getOrderAddr:function(str){
    for(var i = 0;i < str.length;i++){
      if(str.charAt(i) == '县' || str.charAt(i) == '区'){
        that.data.addr = str.substring(0,i+1)
        return
      }
    }
    var i = str.split('').lastIndexOf('市')
    that.data.addr = str.substring(0,i+1)
  },
  getData: function() {
    console.log(that.data.address)
    that.getOrderAddr(that.data.address)
    console.log(that.data.addr)
    const db = wx.cloud.database();

    db.collection('topic')
      .where({addr:that.data.addr})
      .orderBy('date', 'desc')
      .get({
        success: function(res) {
       
          that.data.topics = res.data;
          that.setData({
            topics: that.data.topics,
            
          });
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();

        },
        fail: function(event) {
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
        }
      })

  },
  /**
   * 切换定位
   */
  changeLocation:function(){
    that.getPermission()
  },
  /**
   * item 点击
   */
  onItemClick: function(event) {
    that.jugdeUserLogin()
    var id = event.currentTarget.dataset.topicid;
    var openid = event.currentTarget.dataset.openid;
    //console.log(id);
    console.log(event);
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var temp = [];
    // 获取后面十条
    if (this.data.topics.length < this.data.totalCount) {
      const db = wx.cloud.database();
      db.collection('topic').get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempTopic = res.data[i];
              //console.log(tempTopic);
              temp.push(tempTopic);
            }

            var totalTopic = {};
            totalTopic = that.data.topics.concat(temp);

            //console.log(totalTopic);
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
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }

  },
   /**
   * 判断用户是否登录
   */
  jugdeUserLogin: function(event) {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {

              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})