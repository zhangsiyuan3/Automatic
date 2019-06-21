// component/chartVoice/chartVoice.js
const $common = require('../../utils/common.js')
const $api = require('../../utils/api.js')
Component({
  properties: {
    isRight: {
      type: Boolean,
      value: false
    },
    chartId: {
      type: null
    },
    message: {
      type: String,
      value: '',
      observer(e) {
        const data = e.split('|')
        this.setData({ currentTime: data[1] })
        let duration = this.data.duration = data[1]
        let audio = wx.createInnerAudioContext() //获取音频播放器
        audio.obeyMuteSwitch = false
        audio.onPlay(() => { // 音频播放事件
          this.data.isPlay = true
        })
        audio.onStop(() => { //音频停止事件
          this.data.isPlay = false
          this.setData({ currentTime: duration })
        })
        audio.onEnded(() => { //音频自然播放结束
          this.data.isPlay = false
          this.setData({ currentTime: duration })
        })
        audio.onTimeUpdate(() => { //音频播放进度更新
          // let duration = parseInt(audio.duration) * 1000
          let currentTime = parseInt(audio.currentTime) * 1000
          if (currentTime > duration) currentTime = duration //录音后拿到的时间和使用播放器拿到的时间不一致
          this.setData({ currentTime: duration - currentTime })
        })
        audio.onError(() => { //音频播放错误事件
          audio.stop()
          this.data.isPlay = false
          this.setData({ currentTime: duration })
        })
        audio.onCanplay(() => { //音频可以播放事件
          this.triggerEvent('audiocreate', { key: this.data.chartId, value: audio })
        })
        audio.src = $api.voice + data[0]
        this.data.audio = audio
      }
    }
  },
  data: {
    isPlay: false, //是否播放
    audio: null, //背景播放器实例
    duration: 0,
    currentTime: 0
  },
  methods: {
    play() { //播放
      let { isPlay, audio } = this.data
      if (isPlay) { //播放中
        audio.stop()
      } else {
        audio.play()
        this.triggerEvent('stopaudio', this.data.chartId)
      }
    }
  }
})
