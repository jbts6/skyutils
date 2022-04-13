// index.js
// const app = getApp()
import changelog from '../../changelog';
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
    ],
    changelog: changelog[0]
  },
  jumpTo (e) {
    const page = e.target.dataset.page;
    wx.navigateTo({
      url: `/pages/${page}/index`,
    })
  }
});
