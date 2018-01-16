/*
* 处理与微信交互
* */
const util = require('./util');

const AccessToken = require('./interaction/accessToken'); // AccessToken
const Ticket = require('./interaction/ticket'); // Ticket
const material = require('./interaction/material'); // 素材
const tags = require('./interaction/tags'); // 用户分组
const send = require('./interaction/sendByGroup'); // 群发
const user = require('./interaction/user'); // 获取用户基本信息
const menu = require('./interaction/menu'); // 菜单管理
const semantic = require('./interaction/semantic'); // 语义理解

/*
* access_token读写
* */
function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken; // 获取access_token方法
    this.saveAccessToken = opts.saveAccessToken; // 保存access_token方法
    this.fetchAccessToken(this.getAccessToken)
    this.getTicket = opts.getTicket; // 获取Ticket
    this.saveTicket = opts.saveTicket; // 保存Ticket
};

/*
* access_token部分，拿到全局票据、检查是否过期 、更新
* */
Wechat.prototype.fetchAccessToken = AccessToken.fetchAccessToken;
Wechat.prototype.isValodAccesstoken = AccessToken.isValodAccesstoken;
Wechat.prototype.updateAccesstoken = AccessToken.updateAccesstoken;

/*
* 获取微信签名Ticket, 拿到Ticket票据、检查是否过期 、更新
* */
Wechat.prototype.fetchTicket = Ticket.fetchTicket;
Wechat.prototype.isValodTicket = Ticket.isValodTicket;
Wechat.prototype.updateTicket = Ticket.updateTicket;

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
* 用户管理-分组部分, 创建分组、获取分组、更新分组、删除分组、批量把用户添加到分组
* */
Wechat.prototype.createGroup = tags.createGroup;
Wechat.prototype.fetchGroup = tags.fetchGroup;
Wechat.prototype.updateGroup = tags.updateGroup;
Wechat.prototype.deleteGroup = tags.deleteGroup;
Wechat.prototype.batchtagging = tags.batchtagging;

/*
* 用户管理-获取用户基本信息
* */
Wechat.prototype.fetchUser = user.fetchUser;

/*
* 根据 标签进行群发、OpenID列表进行群发、删除群发、预览
* */
Wechat.prototype.sendByGroup = send.sendByGroup;
Wechat.prototype.sendByOpenID = send.sendByOpenID;
Wechat.prototype.deleteMass = send.deleteMass;
Wechat.prototype.previewMass = send.previewMass;

/*
* 菜单管理，创建菜单、获取菜单、删除菜单、获取自定义菜单配置接口
* */
Wechat.prototype.createMenu = menu.createMenu;
Wechat.prototype.getMenu = menu.getMenu;
Wechat.prototype.deleteMenu = menu.deleteMenu;
Wechat.prototype.currentMenu = menu.currentMenu;

/*
* 语义理解
* */
Wechat.prototype.semantic = semantic.semantic;


Wechat.prototype.reply = function() {
    const content = this.body; // 回复
    const message = this.weixin;// 消息
    const xml = util.tpl(content, message); // 工具函数生成回复用户所需的XML
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
};
module.exports = Wechat;

