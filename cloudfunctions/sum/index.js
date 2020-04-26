

// 云函数入口函数
exports.main = async (event, context) => {
  return event.a + event.b;
}