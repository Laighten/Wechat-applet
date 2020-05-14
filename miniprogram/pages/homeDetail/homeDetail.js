var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    topic: {},
    comments:{},
    id: '',
    firstId:'',
    openid: '',
    isLike: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    replaysSecond:[],
    disabled1:false,
    disabled2:false,
    emptyTopic:false
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    that = this;
    //console.log('disabled1'+that.data.disabled1)
    //console.log('disabled2'+that.data.disabled2)
    
    that.data.id = options.id;
    that.data.openid = options.openid;
    // 获取话题信息
    db.collection('topic').doc(that.data.id).get({
      success: function(res) {
        console.log(res)
        that.topic = res.data;
        that.setData({
          topic: that.topic,
        })
      },
      fail: function(err){
        that.emptyTopic = true
        that.setData({
          emptyTopic: that.emptyTopic,
        })
        /*删除二级评论*/
        wx.cloud.callFunction({
          name: 'delSecondComment',
          data: {
            topicId: that.data.id
          }
        }).then(res => {
          console.log(res)         
        }).catch(err => {
          console.log(err)
        })
        /*删除一级评论*/
        wx.cloud.callFunction({
          name: 'delComment',
          data: {
            topicId: that.data.id
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    })

    // 获取收藏情况
    db.collection('collect')
      .where({
        _openid: that.data.openid,
        _id: that.data.id

      })
      .get({
        success: function(res) {
          if (res.data.length > 0) {
            that.refreshLikeIcon(true)
          } else {
            that.refreshLikeIcon(false)
          }
        },
        fail: console.error
      })

  },

  onShow: function() {
    // 获取回复列表
    that.getReplay()
    that.setData({
      disabled1 : false,
      disabled2 : false
    })
    

    
  },

  getReplay:async function() {
    // 获取回复列表
    var {data:res} = await db.collection('comment')
      .where({
        t_id: that.data.id
      }).get()
      
      var len = 0
      var relength = 0
      for(var i = 0;i < res.length;i++){
        var {data:res1} =  await db.collection('commentSecond')
                .where({
                 t_id: res[i]._id
               }).get()
        relength += res1.length
        that.data.replaysSecond[i] = new Array()
        that.data.replaysSecond[i] = res1
      }
      var len =  relength + res.length
      //console.log(that.data.replaysSecond)
      that.setData({
        replays: res,
        //text:that.data.text,
        replaysSecondArr: that.data.replaysSecond,
        replayslength:len
      })
  },
  
  /**
   * 刷新点赞icon
   */
  refreshLikeIcon(isLike) {
    that.data.isLike = isLike
    that.setData({
      isLike: isLike,
    })
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      //当前显示图片
      current: this.data.topic.images[index],
      //所有图片
      urls: this.data.topic.images
    })
  },
  /**
   * 喜欢点击
   */
  onLikeClick: function(event) {
    console.log(that.data.isLike);
    if (that.data.isLike) {
      // 需要判断是否存在
      that.removeFromCollectServer();
    } else {
      that.saveToCollectServer();
    }
  },
  /**
   * 添加到收藏集合中
   */
  saveToCollectServer: function(event) {
    db.collection('collect').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: that.data.id,
        date: new Date(),
      },
      success: function(res) {
        that.refreshLikeIcon(true)
        //console.log(res)
      },
    })
  },
  /**
   * 从收藏集合中移除
   */
  removeFromCollectServer: function(event) {
    db.collection('collect').doc(that.data.id).remove({

      success: that.refreshLikeIcon(false),
    });
  },

  /**
   * 跳转回复页面
   */
  onReplayClick() {
    that.setData({
      disabled1 : true
    })
    wx.navigateTo({
      url: "../replay/replay?id=" + that.data.id + "&openid=" + that.data.openid + "&topicuser=" + that.data.topic._openid
    })
  },
  onReplaySecondClick(e) {
    that.setData({
      disabled2 : true
    })
    //that.jugdeUserLogin();
    //console.log("1111111111111111"+ e)
    //console.log(e.currentTarget)
    var id = e.currentTarget.dataset.commentid;
    var openid = e.currentTarget.dataset.openid;

    wx.navigateTo({
      //url: "../replaySecond/replay?id=" + that.data.id + "&openid=" + that.data.openid,
      //url: "../replaySecond/replay?id=" + id + "&openid=" + openid 
      url: "../replaySecond/replay?id=" + id + "&openid=" + openid + "&itemId=" + that.data.id 
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})