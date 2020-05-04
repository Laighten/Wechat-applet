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
        if (res.result.openid == 'oa9k446TlT3mS-JwdQVx6Shf0jPU') {
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