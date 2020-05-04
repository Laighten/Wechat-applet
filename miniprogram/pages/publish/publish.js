var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    content: '',
    date:null,
    images: [],
    user: {},
    isLike: false,
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    that = this
    that.jugdeUserLogin();
  },
  /**
   * 获取填写的内容
   */
  getTextAreaContent: function(event) {
    that.data.content = event.detail.value;
  },
  //获取当前时间并转换
  toDate: function () {
    var myDate = new Date();
    //var dateD = myDate.toLocaleDateString();
    var dateY = myDate.getFullYear();;
    var dateM = myDate.getMonth();
    dateM =dateM+1;
    var dateD = myDate.getDate();
    var dateH = myDate.getHours();
    var datem = myDate.getMinutes();
    var dateS = myDate.getSeconds();
    that.data.date = dateY + '-' + dateM+'-'+dateD + ' ' + dateH + ':' + datem + ':' + dateS
    //console.log(that.data.date);
  },
  /**
   * 选择图片
   */
  chooseImage: function(event) {
    wx.chooseImage({
      count: 6,
      success: function(res) {
        // 设置图片
        that.setData({
          images: res.tempFilePaths,
        })
        that.data.images = []
        //console.log(res.tempFilePaths)
        for (var i in res.tempFilePaths) {
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: that.timetostr(new Date()),
            filePath: res.tempFilePaths[i],
            // 成功回调
            success: res => {
              that.data.images.push(res.fileID)
            },
          })
        }
      },
    })
  },
  /**
   * 图片路径格式化
   */
  timetostr(time){
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = randnum +"_"+ time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 发布
   */
  formSubmit: function(e) {
    //console.log('图片：', that.data.images)
    this.toDate();
    this.data.content = e.detail.value['input-content'];
    if (this.data.canIUse) {
      if (this.data.images.length > 0) {
        this.saveDataToServer();
      } else if (this.data.content.trim() != '') {
        this.saveDataToServer();
      } else {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      }
    } else {
      this.jugdeUserLogin();
    }
  },
  /**
   * 保存到待审核集合中
   */
  saveDataToServer: function(event) {
    
    db.collection('waitAdd').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: that.data.content,
        publisherID: null,
        //date: new Date(),
        date: that.data.date,
        images: that.data.images,
        user: that.data.user,
        isLike: that.data.isLike,
      },
      success: function(res) {
        // 保存到发布历史
        // that.saveToHistoryServer();
        // 清空数据
        that.data.content = "";
        that.data.images = [];

        that.setData({
          textContent: '',
          images: [],
        })

        that.showTipAndSwitchTab();
        

      },
    })
  },
  /**
   * 添加成功添加提示，切换页面
   */
  showTipAndSwitchTab: function(event) {
    wx.showToast({
      title: '发布成功,待管理员审核中...',
      icon: 'none',
      duration: 1500
    })
    // wx.switchTab({
    //   url: '../MyMessage/MyMessage',
    // })
  },
  
  /**
   * 删除图片
   */
  removeImg: function(event) {
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.images[index],
      //所有图片
      urls: this.data.images
    })
  },

  /**
   * 添加到发布集合中
   */
  // saveToHistoryServer: function(event) {
  //   db.collection('history').add({
  //     // data 字段表示需新增的 JSON 数据
  //     data: {
  //       content: that.data.content,
  //       //date: new Date(),
  //       date: that.data.date,
  //       images: that.data.images,
  //       user: that.data.user,
  //       isLike: that.data.isLike,
  //     },
  //     success: function(res) {
  //       // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //       console.log(res)
  //     },
  //     fail: console.error
  //   })
  // },


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