import asyncGenerator from '../../utils/asyncGenerator';
let loading = false;

Page({
  data: {
    images: [],
    options: [
      {name: '横向', value: 'horizon', checked: true},
      {name: '纵向', value: 'vertical', checked: false}
    ],
    direction: 'horizon',
    windowWidth: 0,
    windowHeight: 0,
    isReady: false,
    palette: {}
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
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success (res) {
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
    if (loading) {
      return;
    }
    if (this.data.images.length === 0) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '正在拼接',
    });
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
    let width = 0, height = 0, views = [];
    if (this.data.direction === 'horizon') {
      height = Math.max(...arr.map(i => i.height));
      width = arr.reduce((s, n) => s += n.width, 0);
      let left = 0;
      views = arr.map(i => {
        const image = {
          type: 'image',
          url: i.src,
          css:{
            width: i.width + 'px',
            height: i.height + 'px',
            top: (height - i.height) / 2 + 'px',
            left: left + 'px'
          },
        }
        left += i.width;
        return image;
      })
    } else {
      width = Math.max(...arr.map(i => i.width));
      height = arr.reduce((s, n) => s += n.height, 0);
      let top = 0;
      views = arr.map(i => {
        const image = {
          type: 'image',
          url: i.src,
          css: {
            width: i.width + 'px',
            height: i.height + 'px',
            top: top + 'px',
            left: (width - i.width) / 2 + 'px'
          }
        }
        top += i.height;
        return image;
      })
    }
    this.setData({
      palette: {
        width: width + 'px',
        height: height + 'px',
        views: views
      },
      isReady: true
    })
  },
  onImgOK(e) {
    loading = true;
    wx.saveImageToPhotosAlbum({
      filePath: e.detail.path,
    }).then(() => {
      loading = false;
      wx.hideLoading();
      this.setData({
        isReady: false
      })
    })
  }
})