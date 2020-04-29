// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  var data = event.newDate
  db.collection('waitAdd').doc(data).remove({
    success: function (res) {
      console.log(res.data)
    }
  })

}