//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      complete: (res) => {
        this.globalData.openid = res.result.openid
        //console.log(res.result.openid)
        if ((res.result.openid == 'oa9k446TlT3mS-JwdQVx6Shf0jPU') || (res.result.openid == 'oa9k44zSTR6vinVisvj_JeX_iT24') || (res.result.openid == 'oa9k44xlWSjt7SAl9-Wc-bN6A9XI') || (res.result.openid == 'oa9k444b-pWRtqJ4a-AQD4UoD7rM')){
          this.globalData.superAdmin = true
        }
      }
    })

    this.globalData = {
      openid: '',
      superAdmin: false,
      evn: 'laighten-8h7l4',
    }

  }

})