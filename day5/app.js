/* ---验证公众号---
* 微信接口绑定域名配置：
*    1.将token、timestamp、nonce三个参数进行字典排序
*    2.把字典排序的结果进项sha1加密
*    3.将加密后的字符串与signature(签名)对比(相等则为微信请求，才能绑定)。原样返回就可以接入成功
* */

const Koa = require('koa');
const wechat = require('./wechat/g');
const Wechat = require('./wechat/wechat');
const config = require('./config');
const reply = require('./wx/reply');

const app = new Koa();

const ejs = require('ejs');
const crypto = require('crypto');
const heredoc = require('heredoc');

const tpl = heredoc(() => {
    /*
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="wap-font-scale" content="no" />
    <meta name="author" content="ISUX"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="viewport" content="width=device-width, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <title>搜电影</title>
  </head>
  <body>
    <h1>点击标题，开始录音翻译</h1>
    <p id="title"></p>
    <div id="directors"></div>
    <div id="year"></div>
    <div id="poster"></div>
    <script src="http://zeptojs.com/zepto-docs.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <script>
     wx.config({
        debug: false,
        appId: 'wxfad1f2a72bcbabd5', // 必填，公众号的唯一标识
        timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
        nonceStr: '<%= nonceStr %>', // 必填，生成签名的随机串
        signature: '<%= signature %>',// 必填，签名，见附录1
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'previewImage',
            'startRecord',
            'stopRecord',
            'onVoicePlayEnd',
            'translateVoice'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
        var share;
        var previewImage;
        wx.checkJsApi({
            jsApiList: ['onVoicePlayEnd', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                console.log(res)
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
        var isRecording = false;
        // 预览图片------
        $('#poster').on('tap', function () {
            wx.previewImage(previewImage);
        });
        // 录音------
        $('h1').on('tap', function () {
            if (!isRecording) {
                isRecording = true;
                wx.startRecord({
                    cancel: function () {
                        window.alert('不搜！')
                    }
                });

                return
            }
            ;
            isRecording = false;

            wx.stopRecord({
                success: function (res) {
                    var localId = res.localId;
                    wx.translateVoice({
                        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            var result = res.translateResult; // 语音识别的结果

                            $.ajax({
                                type: 'get',
                                url: 'https://api.douban.com/v2/movie/search?q=' + result,
                                dataType: 'jsonp',
                                jsonp: 'callback',
                                success: function (data) {
                                    var subject = data.subjects[0]; // 获取第一条
                                    $('#title').html(subject.title);
                                    $('#year').html(subject.year);
                                    $('#directors').html(subject.directors[0].name);
                                    $('#poster').html('<img src=" ' + subject.images.large + ' " />')

                                    share = {
                                        title: subject.title, // 分享标题
                                        desc: '搜索' + subject.title, // 分享描述
                                        link: 'http://testlang.viphk.ngrok.org/movie', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                        imgUrl: subject.images.large, // 分享图标
                                        type: 'link', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        success: function () {
                                            window.alert('成功！')
                                        },
                                        cancel: function () {
                                            window.alert('失败！')
                                        }
                                    };
                                     wx.onMenuShareAppMessage(share);

                                    previewImage = {
                                        current: subject.images.large, // 当前显示图片的http链接
                                        urls: [] // 需要预览的图片http链接列表
                                    }
                                    data.subjects.forEach(function (item) {
                                        previewImage.urls.push(item.images.large)
                                    })
                                }
                            })
                        }
                    });
                }
            });
        })
    });
    </script>
  </body>
</html>
     */
});

const createNonce = () => { // 生成随机数
    return Math.random().toString(36).substr(2, 15);
};
const createTimestamp = () => { // 时间戳
    return parseInt(new  Date().getTime() / 1000, 10) + "";
};
const _sign = (nonceStr, ticket, timestamp, url) => { // 加密逻辑
    const params = [
        'noncestr=' + nonceStr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ];
    const str = params.sort().join('&');
    const shasum = crypto.createHash('sha1');

    shasum.update(str);

    return shasum.digest('hex')
};
const sign = (ticket, url) => { // 签名算法
    const timestamp = createTimestamp();
    const nonceStr = createNonce();
    const signature = _sign(nonceStr, ticket, timestamp, url);
    return {
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
    }
};
app.use(function *(next) {
    if (this.url.indexOf('/movie') > -1) {
        const wechatApi = new Wechat(config.wechat);
        const data = yield wechatApi.fetchAccessToken();
        const access_token = data.access_token;
        const ticketData = yield wechatApi.fetchTicket(access_token);
        const ticket = ticketData.ticket;
        const url = this.href;
        const params = sign(ticket, url);
        console.log(params)
        this.body = ejs.render(tpl, params);

        return next;
    }

    yield next;
});
app.use(wechat(config.wechat, reply.reply));

app.listen(1234);
console.log('yes: 1234');