const path = require('path');
const util = require('./libs/util');
const wechat_txt = path.join(__dirname, './config/wechat.txt');

const config = {
    wechat: {
        appID: '',
        appSecret: '',
        token: '',
        getAccessToken: () => {
            return util.readFileAsync(wechat_txt)
        },
        saveAccessToken: (data) => {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_txt, data)
        }
    }
};
module.exports = config;