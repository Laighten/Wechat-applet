// miniprogram/pages/applyAdmin/applyAdmin.js
var app = getApp();
var that
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gender: '',
    phoneNum: '',
    reason: '',
    date: '',
    user: {},
    region: ['广东省', '广州市', '海珠区'],
    community: '',
    address:'',
    applyInfo: {},
    applyed: false,
    //radio数据
    genders: [
      { name: '男', value: '男', selected: false },
      { name: '女', value: '女', selected: false }
    ],
  },

  onNameChange: function(e) {
    //console.log('修改了姓名',e.detail.value)
    this.setData({
      name: e.detail.value
    });
  },
  onGenderChange: function(e) {
    //console.log('修改了性别', e.detail.value)
    this.setData({
      gender: e.detail.value
    });
  },
  onPhoneChange: function(e) {
    //console.log('修改了电话号码', e.detail.value)
    this.setData({
      phoneNum: e.detail.value
    });
  },
  RegionChange: function(e) {
    //console.log('修改了地址', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  onCommunityChange: function(e) {
    //console.log('修改了社区地址', e.detail.value)
    this.setData({
      community:e.detail.value
    })
  },
  getTextAreaReason: function(e) {
    //console.log('修改了申请理由', e.detail.value)
    this.setData({
      reason: e.detail.value
    });
  },
  /*
  上传申请信息
  */
  formSubmit: function(e) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
    if (this.data.name == '') {
      if (e.detail.value.name == '') {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return false;
      } else {
        this.setData({
          name: e.detail.value.name
        });
      }
    }
    this.setData({
      gender: e.detail.value.gender
    });
    if (this.data.phoneNum == '') {
      if (e.detail.value.name == '') {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
        return false;
      } else {
        this.setData({
          phoneNum: e.detail.value.phoneNum
        });
      }
    }
    if (!myreg.test(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if(this.data.community == ''){
      if(e.detail.value.community == ''){
        wx.showToast({
          title: '请输入详细地址',
          icon: 'none'
        })
        return false;
      }else{
        this.setData({
          community: e.detail.value.community
        })
      }
    }
    
    if (this.data.reason == '') {
      if (e.detail.value.reason == '') {
        wx.showToast({
          title: '请输入申请理由',
          icon: 'none'
        })
        return false;
      } else {
        this.setData({
          reason: e.detail.value.reason
        });
      }
    }
    if (this.data.name != '' && this.data.gender != '' && this.data.phoneNum != '' && this.data.community != '' && this.data.reason != '') {
      wx.showLoading({
        title: '申请提交中',
      })

      //console.log(JSON.stringify(this.data.applyInfo) == "{}")
      if (JSON.stringify(this.data.applyInfo) == "{}") {
        this.addAdmin()
      } else {
        db.collection('admin').doc(this.data.applyInfo._id).remove({
          success: function(res) {
            console.log('删除成功')
            that.addAdmin()
          }
        })
      }
    }
  },
  /* */
  addAdmin: function() {
    that.toDate()
    // console.log(that.data.name)
    // console.log(that.data.gender)
    // console.log(that.data.phoneNum)
    // console.log(that.data.reason)
    // console.log(that.data.date)
    // console.log(that.data.user)
    // console.log(app.globalData.openid)
    db.collection('admin').add({
      data: {
        state: 0,
        name: this.data.name,
        gender: this.data.gender,
        phoneNum: this.data.phoneNum,
        region:this.data.region,
        community:this.data.community,
        reason: this.data.reason,
        date: that.data.date,
        user: that.data.user
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '申请成功',
        success: function() {
          setTimeout(function() {
            //要延时执行的代码
            wx.switchTab({
              url: '../me/me',
            });
          }, 1000) //延迟时间

        }
      })

    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '申请失败',
        icon: 'none'
      });
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    //console.log(this.options)
    if (this.options.info != ' ') {
      var items = JSON.parse(this.options.info);

      this.setData({
        applyInfo: items,
        applyed: true,
        region: items.region
      })
      if (items.gender == '男') {
        //设置selected为true
        that.data.genders[0].selected = true;
        that.data.genders[1].selected = false;
        //更新data中的数据
        that.setData({
          genders: that.data.genders
        })
      } else {
        that.data.genders[0].selected = false;
        that.data.genders[1].selected = true;
        that.setData({
          genders: that.data.genders
        })
      }
    }
    console.log(this.data.region)
    that.jugdeUserLogin();
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
              //console.log(that.data.user)
            }
          })
        }
      }
    })
  },
  //获取当前时间并转换
  toDate: function() {
    var myDate = new Date();
    //var dateD = myDate.toLocaleDateString();
    var dateY = myDate.getFullYear();;
    var dateM = myDate.getMonth();
    dateM = dateM + 1;
    var dateD = myDate.getDate();
    var dateH = myDate.getHours();
    var datem = myDate.getMinutes();
    var dateS = myDate.getSeconds();
    that.data.date = dateY + '-' + dateM + '-' + dateD + ' ' + dateH + ':' + datem + ':' + dateS
    //console.log(that.data.date);
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