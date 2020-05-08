var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    id: '',
    openid: '',
    firstopenid:'',
    user:{},
    content: '',
    itemId:'',//评论的通讯的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.data.id = options.id;
    that.data.openid = options.openid;
    that.data.itemId = options.itemId;
    that.jugdeUserLogin();
  },
   //获取当前时间并转换
   formatNumber:function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  
    toDate: function () {
      var myDate = new Date();
      //var dateD = myDate.toLocaleDateString();
      var dateY = this.formatNumber(myDate.getFullYear());
      var dateM = this.formatNumber(myDate.getMonth() + 1);
      var dateD = this.formatNumber(myDate.getDate()) ;
      var dateH = this.formatNumber(myDate.getHours()) ;
      var datem = this.formatNumber(myDate.getMinutes()) ;
      var dateS = this.formatNumber( myDate.getSeconds());
      that.data.date = dateY + '-' + dateM+'-'+dateD + ' ' + dateH + ':' + datem + ':' + dateS
      //console.log(that.data.date);
    },
  bindKeyInput(e) {
    //this.toDate();
    that.data.content = e.detail.value;
    console.log("内容：" + that.data.content)

  },
 
 

  // saveReplay: function() {
  //   this.toDate();
  //   wx.cloud.callFunction({
  //     name: 'updateSecondReplay',//函数名
  //     data:{
  //       t_id_first:that.data.id,
  //       content: that.data.content,
  //       user: that.data.user,
  //     },
  //     success: function(res) {
  //       console.log(res.result)
  //       wx.showToast({
  //         title: '发射成功',
  //       })
  //       setTimeout(function() {
  //         wx.navigateBack({
  //           url: "../homeDetail/homeDetail?id=" + that.data.id + "&openid=" + that.data.openid
  //         })
  //       }, 1500)

  //     },
  //     fail: console.error
  //   })




    // db.collection('comment').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     content: that.data.content,
    //     //date: new Date(),
    //     date: that.data.date,
    //     r_id: that.data.id,
    //     u_id: that.data.openid,
    //     t_id: that.data.id,
    //     user: that.data.user,
    //     firstopenid:that.data.firstopenid
    //   },
    saveReplay: function() {
      this.toDate();
      if (that.data.content.trim() == '') {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      } else {
        db.collection('commentSecond').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            content: that.data.content,
            //date: new Date(),
            date: that.data.date,
            r_id: that.data.id,
            u_id: that.data.openid,
            t_id: that.data.id,
            user: that.data.user,
            readState: 0,        //标记为未读状态
            topicId: that.data.itemId,
          },

          success: function (res) {
            wx.showToast({
              title: '发射成功',
            })
            setTimeout(function () {
              wx.navigateBack({
                url: "../homeDetail/homeDetail?id=" + that.data.id + "&openid=" + that.data.openid
              })
            }, 1500)

          },
          fail: console.error
        })
      }
    },



   
  
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
    }
  })
