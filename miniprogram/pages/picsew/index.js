import asyncGenerator from '../../utils/asyncGenerator';

Page({
  data: {
    images: [],
    options: [
      {name: '横向', value: 'horizon', checked: true},
      {name: '纵向', value: 'vertical', checked: false}
    ],
    direction: 'horizon',
    windowWidth: 0,
    windowHeight: 0
  },
  onReady() {
    this.setSize();
  },
  async setSize() {
    const {windowWidth, windowHeight} = await wx.getSystemInfo();
    this.setData({
      windowWidth,
      windowHeight
    });
  },
  radioChange(e) {
    const options = this.data.options;
    const value = e.detail.value;
    for (let i = 0, len = options.length; i < len; ++i) {
      options[i].checked = options[i].value === value
    }
    this.setData({
      options,
      direction: value
    })
  },
  chooseImage() {
    const self = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        self.setData({images: tempFilePaths});
      }
    })
  },
  previewImage(e) {
    const current = e.target.dataset.src;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  async generate() {
    let arr = [];
    for await (const [src] of asyncGenerator(this.data.images)) {
      const {width, height} = await wx.getImageInfo({
        src,
      })
      arr.push({
        src,
        width,
        height
      })
    }
    console.log(arr);
  }
})