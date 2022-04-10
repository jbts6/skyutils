// index.js
// const app = getApp()
const {sha512} = require('./sha512.min.js');

Page({
  data: {
    password: '',
    code: '',
    length: 16,
    useSymbol: true,
    result: ''
  },
  generate() {
    const {password, code, length, useSymbol} = this.data;
    if (password && code) {
      const hash = this.hexPassword(password, code);
      const result = this.seekPassword(hash, length, useSymbol);
      wx.setClipboardData({ data: result });
      this.setData({result});
    } else {
      wx.showToast({
        title: '请填写密码和代码',
        icon: 'none',
        duration: 2000
      })
      
    }
  },
  hexPassword(pwd, code) {
    const hexone = sha512.hmac(pwd, code);
    const hextwo = sha512.hmac('hello', hexone);
    const hexthree = sha512.hmac('world', hextwo);
    const source = hextwo.split('');
    const rule = hexthree.split('');
    for(let i = 0;i<source.length;i++) {
      if (isNaN(source[i]))
            "whenthecatisawaythemicewillplay".search(rule[i]) > -1 &&
                (source[i] = source[i].toUpperCase());
    }
    return source.join("");
  },
  seekPassword(hash, length, useSymbol) {
    const lower = "abcdefghijklmnopqrstuvwxyz".split("");
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const num = "0123456789".split("");
    const symbols = ",.:;!?".split("");
    let codes = lower.concat(num);
    if (useSymbol) {
      codes = codes.concat(symbols);
    }
    codes = codes.concat(upper);
    const subHash = hash.slice(0, length).split('');
    let count = 0;
    const skPwd = subHash.map(c => {
      return count = (count + c.charCodeAt()) % codes.length;
    }).map(k => codes[k])
    return skPwd.join('');
  }
});
