// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  var id = event._id
  var num = event.num
  if(num == 1){
    try {
      return await db.collection('waitAdd').doc(id).remove()
    } catch (e) {
      console.log(e)
    }
  }else if(num == 2){
    try {
      return await db.collection('topic').doc(id).remove()
    } catch (e) {
      console.log(e)
    }
  }else if(num == 3){
    try {
      return await db.collection('deny').doc(id).remove()
    } catch (e) {
      console.log(e)
    }
  }
  
}