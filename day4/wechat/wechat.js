/*
* 处理与微信交互
* */
const util = require('./util');

const AccessToken = require('./interaction/accessToken'); // AccessToken
const material = require('./interaction/material'); // 素材
const tags = require('./interaction/tags'); // 用户分组
const send = require('./interaction/sendByGroup'); // 群发
const user = require('./interaction/user'); // 获取用户基本信息

/*
* access_token读写
* */
function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken; // 获取access_token方法
    this.saveAccessToken = opts.saveAccessToken; // 保存access_token方法

    this.fetchAccessToken(this.getAccessToken)
};

/*
* access_token部分，拿到全局票据、检查是否过期 、更新
* */
Wechat.prototype.fetchAccessToken = AccessToken.fetchAccessToken;
Wechat.prototype.isValodAccesstoken = AccessToken.isValodAccesstoken;
Wechat.prototype.updateAccesstoken = AccessToken.updateAccesstoken;

/*
* 素材部分，上传、下载、删除、更新素材总数、更新素材列表、获取
* */
Wechat.prototype.uploadMaterial = material.uploadMaterial;
Wechat.prototype.fetchMaterial = material.fetchMaterial;
Wechat.prototype.deleteMaterial = material.deleteMaterial;
Wechat.prototype.batchMaterial = material.batchMaterial;
Wechat.prototype.countMaterial = material.countMaterial;
Wechat.prototype.updateMaterial = material.updateMaterial;

/*
* 用户管理-分组部分
* */
Wechat.prototype.createGroup = tags.createGroup;
Wechat.prototype.fetchGroup = tags.fetchGroup;
Wechat.prototype.updateGroup = tags.updateGroup;
Wechat.prototype.deleteGroup = tags.deleteGroup;

/*
* 用户管理-获取用户基本信息
* */
Wechat.prototype.fetchUser = user.fetchUser;

/*
* 根据标签进行群发
* */
Wechat.prototype.sendByGroup = send.sendByGroup;

Wechat.prototype.reply = function() {
    const content = this.body; // 回复
    const message = this.weixin;// 消息
    const xml = util.tpl(content, message); // 工具函数生成回复用户所需的XML
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
};
module.exports = Wechat;