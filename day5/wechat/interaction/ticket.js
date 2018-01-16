// 获取微信签名
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    ticket: {
        get: prefix + 'ticket/getticket?'
    }
};

/*
* 获取微信签名Ticket
* */
exports.fetchTicket = function (access_token) {
    return this.getTicket()
        .then((data) => {
            try {
                data = JSON.parse(data)
            }catch (e){
                return this.updateTicket(access_token); // Ticket文件不存在或出错是去更新
            }

            // 判断是否在有效期内
            if (this.isValodTicket(data)){
                return Promise.resolve(data);// 继续传递下去
            } else {
                return this.updateTicket(access_token);
            }
        })
        .then((data) => { // 最终合法的data
            this.saveTicket(data);

            return Promise.resolve(data);
        })
};

/*
* 检查 Ticket 是否过期
* */
exports.isValodTicket = (data) => {
    if(!data || !data.ticket || !data.expires_in) {
        return false;
    }
    const ticket = data.ticket;
    const expires_in = data.expires_in;
    const now = (new Date().getTime());
    if(ticket && now < expires_in){ //  判断是否过期
        return true;
    } else {
        return false;
    }
};

/*
* 更新 Ticket
* */
exports.updateTicket = function(access_token) {
    const url = api.ticket.get + '&access_token=' + access_token + '&type=jsapi';
    return new Promise((resolve, reject) => {
        request({ // 发起请求
            url: url,
            json: true
        }).then((response) => {
            const data = response.body;
            const now = (new Date().getTime());
            // 当前时间+票据返回的过期时间(7020s刷新) = 存起来的过期时间
            const expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;

            resolve(data)
        })
    });
};