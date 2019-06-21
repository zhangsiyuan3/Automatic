// pages/judge/judge.js
const $common = require('../../utils/common.js');
const $api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getopenid() {
    $common.getOpenId().then((res) => {
      if (wx.getStorageSync('UserExistence') == true && wx.getStorageSync('UserFrozenState') == 0) {
        wx.reLaunch({
          url: '../Home/Communication/Communication',
        })
      } else {
        wx.reLaunch({
          url: '../login/login',
        })
      }
    }).catch(err => {
      console.log('err', err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getopenid()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})