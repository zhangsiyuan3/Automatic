const $common = require('../../utils/common.js');
const $api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Address: '', //地址
    bo_end: false
  },
  //获取并更新用户头像等信息
  // 参数：【openId】【avaUrl】用户头像【nickName】用户昵称【userType】暂时固定传0
  getUserInfo() {
    let openid = wx.getStorageSync('openid')
    let userinfo = wx.getStorageSync('userinfo')
    let userType = wx.getStorageSync('userType')
    $common.request($api.UpdateAvaUrlNick, {
        openId: openid,
        nickName: userinfo.nickName,
        userType: userType,
        avaUrl: userinfo.avatarUrl
      })
      .then(res => {
        $common.hide();
        if (res.data.res) {
          if (wx.getStorageSync('UserFrozenState') == 0) {
            wx.reLaunch({
              url: '../Home/Communication/Communication',
            })
          }
        }
      })
  },
  //获取当前用户冻结状态
  GetUserFrozen() {
    let openid = wx.getStorageSync('openid')
    $common.request($api.GetUserFrozenState, {
        openId: openid,
      userType: wx.getStorageSync('userType')
      })
      .then(res => {
        $common.hide()
        if (res.data.FrozenState==0){
          wx.reLaunch({
            url: '../Home/Communication/Communication',
          })
        }else{
          $common.showToast('您的账号已被冻结')
        }
      })
  },
  openid(){//获取openid
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        $common.request($api.GetSaveUserOpenId, {
          code: res.code,
          userType: 0
        })
          .then(res => {
            if (res.data.res) {
              wx.setStorageSync('openid', res.data.openid)
              wx.setStorageSync('UserExistence', res.data.UserExistence)
              wx.setStorageSync('UserFrozenState', res.data.UserFrozenState)
              wx.setStorageSync('userType', 0)
              if (res.data.UserExistence == true && res.data.UserFrozenState == 0) {
                wx.reLaunch({
                  url: '../Home/Communication/Communication',
                })
              } else {
                console.log(123)
                if (res.data.UserFrozenState == 1) {
                  $common.showToast('您的账户已被冻结')
                }
              }
            }
          }).then(res=>{
            this.getUserInfo()
          })
      }
    })
    
  },
  //获取openid
  getopenid() {
    $common.getOpenId().then((res) => {
      $common.hide()
      console.log(wx.getStorageSync('UserExistence'))
      console.log(wx.getStorageSync('UserFrozenState'))
      if (wx.getStorageSync('UserExistence') == true && wx.getStorageSync('UserFrozenState')==0) {
        console.log(123)
        wx.reLaunch({
          url: '../Home/Communication/Communication',
        })
      }else{
        console.log(123)
        if (wx.getStorageSync('UserFrozenState')==1){
          $common.showToast('您的账户已被冻结')
        }
      }
    }).then(res=>{
      this.getUserInfo()
    }).catch(err => {
      console.log('err', err)
    })
  },
  //获取用户信息
  info() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              // 存储基本信息
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    wx.setStorageSync('userinfo', e.detail.userInfo)
    $common.loading('登录中...')
    this.openid()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // $common.loading();
    // this.getopenid()
    this.openid()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})