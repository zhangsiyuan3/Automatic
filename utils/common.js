const mapKey = require('./qqmap.js')
const $api = require('./api.js')
module.exports = {
  //请求数据
  request(url, data, method = 'POST') { //请求
    return new Promise((resolve, reject) => wx.request({
      url,
      data,
      method,
      header: {
        'content-type': 'application/json'
      },
      success: resolve,
      fail: reject
    }))
  },
  getLocation() { //获取当前坐标
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: resolve,
        fail: reject
      })
    })
  },
  getCurrentLocation() { //获取当前位置
    return new Promise((resolve, reject) => {
      this.getLocation()
        .then(this.reverseGeocoder)
        .then(resolve)
        .catch(reject)
    })
  },
  reverseGeocoder(options) { //腾讯地图，逆地址解析
    const {
      latitude,
      longitude
    } = options
    return new Promise((resolve, reject) => {
      mapKey.reverseGeocoder({
        location: {
          latitude,
          longitude
        },
        success: res => res.status === 0 ? wx.setStorageSync('currentLocation', res.result) || resolve(res) : reject(res),
        fail: reject
      })
    })
  },
  //从本地相册选择图片或使用相机拍照
  chooseImage(success, count) {
    count = parseInt(count) ? count : 9;
    success = typeof(success) === 'function' ? success : function(res) {};
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: success,
    })
  },
  uploadFile() { //上传文件
    return new Promise((resolve, reject) => wx.uploadFile({
      url,
      success: reject
    }))
  },
  loading(title = '请求中...', mask = true) {
    wx.showLoading({
      title,
      mask
    })
  },
  hide() {
    wx.hideLoading()
  },
  unique(arr, id) { //数组去重
    let hash = {}
    return arr.reduce((item, target) => {
      hash[target[id]] ? '' : hash[target[id]] = true && item.push(target)
      return item
    }, [])
  },
  showToast(title = '提示内容', icon = 'none', duration = 1500, mask = false) {
    return new Promise((resolve, reject) => wx.showToast({
      title,
      icon,
      mask,
      duration
    }))
  },
  login() {
    return new Promise((resolve, reject) => wx.login({
      success: resolve,
      fail: reject
    }))
  },
  getOpenId() { //获取openId
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('openid')) return resolve()
      this.login()
        .then(res => this.request($api.GetSaveUserOpenId, {
          code: res.code,
          userType: 0
        }))
        .then(res => {
          if (res.data.res) {
            wx.setStorageSync('openid', res.data.openid)
            wx.setStorageSync('UserExistence', res.data.UserExistence)
            wx.setStorageSync('UserFrozenState', res.data.UserFrozenState)
            wx.setStorageSync('userType', 0)
            /**
             * 因获取手机号session_key过期问题，解决方案
             * 存储两个session_key后台会循环验证
             * session_key必须有值，New_session_key可有可无
             */
            let session_key = wx.getStorageSync('session_key')
            let New_session_key = wx.getStorageSync('New_session_key')
            let data_session_key = res.data.session_key
            wx.setStorageSync('session_key', session_key ? New_session_key === data_session_key ? session_key : New_session_key : data_session_key)
            wx.setStorageSync('New_session_key', data_session_key)
            resolve()
          }
        })
    })
  },
  //对象按键值排序方法
  ksort(obj) {
  let temp = 'Action';
  let k_arr = [];
  for (var x in obj) {
    k_arr.push(x);
  }
  k_arr.sort();
  let res = {};
  for (let i = 0; i < k_arr.length; i++) {
    let k = k_arr[i];
    res[k] = obj[k];
  }
  return res;
},
  // base64
  base64_decode(input) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = base64EncodeChars.indexOf(input.charAt(i++));
      enc2 = base64EncodeChars.indexOf(input.charAt(i++));
      enc3 = base64EncodeChars.indexOf(input.charAt(i++));
      enc4 = base64EncodeChars.indexOf(input.charAt(i++));
      chr1 = (enc1 < 2 > 4);
      chr2 = ((enc2 & 15) << 4 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return this.utf8_decode(output);
  },
  // utf-8
  utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = 0
    var c1 = c
    var c2 = c1;
    console.log(c2)
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        var c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
  //这个是找了很久的加密函数
  b64_hmac_sha1(k, d, _p, _z) {
    // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
    // _p = b64pad, _z = character size; not used here but I left them available just in case
    if (!_p) {
      _p = '=';
    }
    if (!_z) {
      _z = 8;
    }

    function _f(t, b, c, d) {
      if (t < 20) {
        return (b & c) | ((~b) & d);
      }
      if (t < 40) {
        return b ^ c ^ d;
      }
      if (t < 60) {
        return (b & c) | (b & d) | (c & d);
      }
      return b ^ c ^ d;
    }

    function _k(t) {
      return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }

    function _s(x, y) {
      var l = (x & 0xFFFF) + (y & 0xFFFF),
        m = (x >> 16) + (y >> 16) + (l >> 16);
      return (m << 16) | (l & 0xFFFF);
    }

    function _r(n, c) {
      return (n << c) | (n >>> (32 - c));
    }

    function _c(x, l) {
      x[l >> 5] |= 0x80 << (24 - l % 32);
      x[((l + 64 >> 9) << 4) + 15] = l;
      var w = [80],
        a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878,
        e = -1009589776;
      for (var i = 0; i < x.length; i += 16) {
        var o = a,
          p = b,
          q = c,
          r = d,
          s = e;
        for (var j = 0; j < 80; j++) {
          if (j < 16) {
            w[j] = x[i + j];
          } else {
            w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          }
          var t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j)));
          e = d;
          d = c;
          c = _r(b, 30);
          b = a;
          a = t;
        }
        a = _s(a, o);
        b = _s(b, p);
        c = _s(c, q);
        d = _s(d, r);
        e = _s(e, s);
      }
      return [a, b, c, d, e];
    }

    function _b(s) {
      var b = [],
        m = (1 << _z) - 1;
      for (var i = 0; i < s.length * _z; i += _z) {
        b[i >> 5] |= (s.charCodeAt(i / 8) & m) << (32 - _z - i % 32);
      }
      return b;
    }

    function _h(k, d) {
      var b = _b(k);
      if (b.length > 16) {
        b = _c(b, k.length * _z);
      }
      var p = [16],
        o = [16];
      for (var i = 0; i < 16; i++) {
        p[i] = b[i] ^ 0x36363636;
        o[i] = b[i] ^ 0x5C5C5C5C;
      }
      var h = _c(p.concat(_b(d)), 512 + d.length * _z);
      return _c(o.concat(h), 512 + 160);
    }

    function _n(b) {
      var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        s = '';
      for (var i = 0; i < b.length * 4; i += 3) {
        var r = (((b[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((b[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((b[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
          if (i * 8 + j * 6 > b.length * 32) {
            s += _p;
          } else {
            s += t.charAt((r >> 6 * (3 - j)) & 0x3F);
          }
        }
      }
      return s;
    }

    function _x(k, d) {
      return _n(_h(k, d));
    }
    return _x(k, d);
  }
}