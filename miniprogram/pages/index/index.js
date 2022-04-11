// index.js
// const app = getApp()
Page({
  data: {
    pages: [
      [
        {
          name: '密码生成',
          page: 'generatePassword',
          color: '#DDDDDD',
          icon: ''
        },
        {
          name: '图片拼接',
          page: 'picsew',
          color: '#DDDDDD',
          icon: ''
        }
      ]
    ]
  },
  jumpTo (e) {
    const page = e.target.dataset.page;
    wx.navigateTo({
      url: `/pages/${page}/index`,
    })
  }
});
