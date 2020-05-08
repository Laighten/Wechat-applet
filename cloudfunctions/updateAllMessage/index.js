// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event.id)
    return await db.collection('commentSecond').where({
      u_id:event.u_id,
      readState:0
    })
      .update({
        data: {
          readState: 1
        },
      })
  } catch (e) {
    console.error(e)
  }
}