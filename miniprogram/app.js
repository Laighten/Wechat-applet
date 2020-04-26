//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      //openid: 'oa9k44zSTR6vinVisvj_JeX_iT24',
      evn: 'laighten-8h7l4'
    }
  }
})