const config = require('./config');
const Wechat = require('./wechat/wechat');
const wechatApi = new Wechat(config.wechat);
exports.reply = function* (next) {
    const message = this.weixin;
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码：' + message.EventKey + ' ' + message.ticket)
            }
            this.body = '欢迎订阅浪哥 \n 发送 1  --查看一傻 \n 发送 2 --查看二傻 \n 发送 3 --查看三傻';
        } else if (message.Event === 'unsubscribe') {
            console.log('取消关注');
            this.body = '';
        } else if (message.Event === 'LOCATION') {
            this.body = '您的位置：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        } else if (message.Event === 'CLICK') {
            this.body = '点击菜单：' + message.EventKey;
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket);
            this.body = '看到后扫一下哦';
        } else if (message.Event === 'VIEW') {
            this.body = '点击了菜单中的链接：' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        const content = message.Content;
        let reply = '写 ' + message.Content + ' 干嘛? \n 发送 1  --查看一傻 \n 发送 2 --查看二傻 \n 发送 3 --查看三傻';
        if (content === '666') {
            reply = [{
                title: '对于reset.css应该知道的！',
                description: '作为前端，我们在写 CSS 样式之前，一般都会来一份 reset.css ',
                picUrl: 'http://www.langok.com/wp-content/uploads/2017/10/IMG_4834.jpg',
                url: 'http://www.langok.com/%E5%AF%B9%E4%BA%8Ereset-css/'

            }];
        } else if (content === '1') {
            const data = yield wechatApi.uploadMaterial('image', __dirname + '/1.png');
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        } else if (content === '2') {
            const data = yield wechatApi.uploadMaterial('image', __dirname + '/2.png');
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        } else if (content === '3') {
            const data = yield wechatApi.uploadMaterial('image', __dirname + '/3.png');
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        } else if (content === '4') {
            const data = yield wechatApi.uploadMaterial('video', __dirname + '/7.mp4', {
                type: 'video',
                description: '{"title": "langge", "introduction": "nsnsnsn"}'
            });
            console.log('datadata', data)
            reply = {
                type: 'video',
                title: '回复视频',
                description: 'hahaha',
                mediaId: data.media_id
            };
        } else if (content === '5') {
            const picData = yield wechatApi.uploadMaterial('image', __dirname + '/2.png', {});
            console.log('ddd', picData);
            const meida = {
                articles: [{
                    title: 'tututu',
                    thumb_media_id: 'YGZWDndWG_r9gtmBfH9fR2nTwuZY9T8IJXRXvvUdAzE',
                    author: 'Lang',
                    digest: '摘要',
                    show_cover_pic: 1,
                    content: '内容',
                    content_source_url: 'https://github.com/'
                }]
            };
            const data = yield wechatApi.uploadMaterial('news', meida, {});
            const data2 = yield wechatApi.fetchMaterial(data.media_id, 'news', {});

            const items = data2.news_item;
            let news = [];

            items.forEach((item) => {
                news.push({
                    title: item.title,
                    description: item.digest,
                    picUrl: picData.url,
                    url: item.url
                })
            });
            reply = news;
        } else if (content === '6') {
            const count = yield wechatApi.countMaterial();
            const list = yield [
                wechatApi.batchMaterial({
                    type: 'image',
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchMaterial({
                    type: 'video',
                    offset: 0,
                    count: 10
                })
            ];
            console.log(JSON.stringify(list))
        } else if (content === '7') {
            const createGroup = yield wechatApi.createGroup('广西');
            console.log(createGroup);

            reply = 'createGroup'
        } else if (content === '8') {
            const fetchGroup = yield wechatApi.fetchGroup();
            console.log(fetchGroup);
            reply = 'fetchGroup'
        } else if (content === '9') {
            const mpnews = {
                media_id: 'YGZWDndWG_r9gtmBfH9fR48x6wcXpx4aX6LQ0QJm-YM'
            };
            const msgData = yield wechatApi.sendByGroup('image', mpnews, 2)
            console.log('msgData', msgData)
            reply = 's'
        } else if (content === '10') {
            const user = yield wechatApi.fetchUser(message.FromUserName, 'zh_CN');
            console.log('user', user);
            reply = 's'
        }

        this.body = reply;
    }
    yield next;
};