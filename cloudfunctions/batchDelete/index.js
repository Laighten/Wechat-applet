// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command;
  var date=event.newDate
  console.log(date)
  try{
      return await db.collection('topic').where({
        date: _.gte(date)
      }).remove();
  }catch(e){
      console.error(e);
  }
 
}