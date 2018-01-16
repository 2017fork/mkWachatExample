const path = require('path');
const util = require('./libs/util');
const wechat_txt = path.join(__dirname, './config/wechat.txt');
const wechat_ticket = path.join(__dirname, './config/wechat_ticket.txt');

const config = {
    wechat: {
        appID: 'wxfad1f2a72bcbabd5',
        appSecret: '',
        token: 'langge',
        getAccessToken: () => {
            return util.readFileAsync(wechat_txt)
        },
        saveAccessToken: (data) => {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_txt, data)
        },
        getTicket: () => {
            return util.readFileAsync(wechat_ticket)
        },
        saveTicket: (data) => {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_ticket, data)
        }
    }
};
module.exports = config;