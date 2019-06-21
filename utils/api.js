const phoneReg = /^(1[3456789]|9[28])\d{9}$/ // 正则手机号码
const http = `qjkf.1-zhao.fun`
const host = `https://${http}`
const CustServerAva = `${host}/Content/CustServerAva/` //客服头像路径
const webStock = `wss://${http}/WebSocketServer.ashx`; //聊天
module.exports = {
  CustServerAva, 
  webStock,
  tencentcloudapi: `https://aai.tencentcloudapi.com/`,
  //保存或获取用户openID 参数【 code】【 userType】 暂时固定传0
  GetSaveUserOpenId: `${host}/ltp/UserInfo/GetSaveUserOpenId`,
  // 更新用户昵称与头像 参数：【 openId】【 avaUrl】 用户头像【 nickName】 用户昵称【 userType】 暂时固定传0
  UpdateAvaUrlNick: `${host}/ltp/UserInfo/UpdateAvaUrlNick`,
  //获取某用户冻结状态 参数【OpenId】【UserType】暂时固定传0   冻结状态    0： 正常   1：冻结
  GetUserFrozenState: `${host}/ltp/UserInfo/GetUserFrozenState`,
  //获取聊天时参数 参数【OpenId】  返回值：【StCustServiceAvaUrl】客服头像  【StWelcome】欢迎词        UserHeadPortraitUrl【用户头像】
  GetSystemInfo: `${host}/ltp/ChatRecord/GetSystemInfo`,
  //上传活动音频
  UpLoadVoice: `${host}/ltp/ChatRecord/UpLoadVoice`,
  //获取聊天记录
  GetChatRecord: `${host}/ltp/ChatRecord/GetChatRecord`

}