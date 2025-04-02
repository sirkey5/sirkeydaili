// 代理配置
var proxy = "PROXY 192.168.1.55:10808";
var direct = 'DIRECT';

// 中国域名列表
var directDomains = [
    "cloudflare.com", "gov.cn", "115.com", "123pan.com", "123957.com", "baidu.com", "baidupcs.com", "baidustatic.com", "bdimg.com", "bdstatic.com", "cdn.bcebos.com", "cdnnode.cn", "qq.com", "weixinbridge.com", "gtimg.com", "gtimg.cn", "qstatic.com", "cdn-go.cn", "qpic.cn", "qlogo.cn", "qqmail.com", "tencent.com", "bilibili.com", "hdslb.com", "bilivideo.cn", "biliapi.net", "iqiyi.com", "iqiyipic.com", "qy.net", "71edge.com", "youku.com", "ykimg.com", "tower.im", "weibo.com", "weibo.cn", "weibocdn.com", "sinaimg.cn", "sinajs.cn", "sina.cn", "taobao.com", "aliyun.com", "aliyuncs.com", "alicdn.com", "alibabausercontent.com", "alipay.com", "alipayobjects.com", "aliyundrive.com", "dingtalk.com", "mmstat.com", "tmall.com", "jd.com", "360buyimg.com", "300hu.com", "126.com", "163.com", "189.cn", "21cn.com", "139.com", "10086.cn", "pinduoduo.com", "pddpic.com", "zijieapi.com", "amemv.com", "ecombdapi.com", "baike.com", "byteimg.com", "douyin.com", "douyinpic.com", "douyinstatic.com", "douyinvod.com", "supercachenode.com", "bytedance.com", "bytedanceapi.com", "bytescm.com", "bytecdn.cn", "byteoc.com", "bytednsdoc.com", "bytetcc.com", "feishu.cn", "feishucdn.com", "toutiao.com", "toutiaoimg.com", "toutiaostatic.com", "yhgfb-cn-static.com", "cmbchina.com", "mi.com", "xiaomi.com", "amap.com", "autonavi.com", "meituan.com", "meituan.net", "sogou.com", "dianping.com", "quark.cn", "wps.cn", "wpscdn.cn", "xiaohongshu.com", "xhscdn.com", "push.apple.com", "setup.icloud.com", "appldnld.apple.com", "oscdn.apple.com", "osrecovery.apple.com", "swcdn.apple.com", "swdist.apple.com", "swdownload.apple.com", "swscan.apple.com", "updates-http.cdn-apple.com", "updates.cdn-apple.com", "audiocontentdownload.apple.com", "devimages-cdn.apple.com", "devstreaming-cdn.apple.com", "oscdn.apple.com", "certs.apple.com", "ocsp.apple.com", "ocsp2.apple.com", "valid.apple.com", "appleid.cdn-apple.com", "icloud.com.cn", "guzzoni.apple.com", "app-site-association.cdn-apple.com", "smp-device-content.apple.com", "idv.cdn-apple.com", "adcdownload.apple.com", "alpdownloadit.cdn-apple.com", "bricks.cdn-apple.com", "self.events.data.microsoft.com", "mobile.events.data.microsoft.com", "browser.events.data.microsoft.com", "ocsp.globalsign.com", "ocsp2.globalsign.com", "ocsp.digicert.cn", "ocsp.dcocsp.cn", "api.onedrive.com", "storage.live.com", "skyapi.live.net", "roaming.officeapps.live.com", "blob.core.windows.net", "default.exp-tas.com"
];

// 需要使用代理的域名列表
var domainsUsingProxy = [
    "tiktok.com", "google.com.hk", "ent.com", "youtube.com", "googlevideo.com", "ytimg.com", "github.com", "github.io", "githubusercontent.com", "githubassets.com", "bing.com", "bing.cn", "bing.net", "bingapis.com", "live.com", "stackoverflow.com", "wikipedia.org", "godaddy.com", "twitter.com", "x.com", "twimg.com", "docker.com", "facebook.com", "facebook.net", "fbcdn.net", "segment.io", "unpkg.com", "jsdelivr.com", "tv.apple.com", "instagram.com", "cdninstagram.com", "reddit.com", "redd.it", "whatsapp.com", "whatsapp.net"
];

// 本地 TLD 列表
var localTlds = [".test", ".localhost"];

// 中国 IP 段列表（这里只是示例，需要从公开数据源获取更详细的列表）
var chinaIpRanges = [
    "1.0.0.0/8",
    "2.0.0.0/7",
    "3.0.0.0/8"
    // 添加更多中国 IP 段
];

// 检查 IP 是否在中国 IP 段内
function isIpInChina(ip) {
    for (var i = 0; i < chinaIpRanges.length; i++) {
        var range = chinaIpRanges[i].split('/');
        var baseIp = range[0];
        var mask = parseInt(range[1], 10);
        var baseIpNum = ipToNum(baseIp);
        var ipNum = ipToNum(ip);
        var maskNum = (0xFFFFFFFF << (32 - mask)) >>> 0;
        if ((ipNum & maskNum) === (baseIpNum & maskNum)) {
            return true;
        }
    }
    return false;
}

// 将 IP 地址转换为数字
function ipToNum(ip) {
    var parts = ip.split('.');
    return (parseInt(parts[0], 10) << 24) +
        (parseInt(parts[1], 10) << 16) +
        (parseInt(parts[2], 10) << 8) +
        parseInt(parts[3], 10);
}

// 检查域名是否在列表中
function isDomainInList(domain, list) {
    for (var i = 0; i < list.length; i++) {
        if (domain.endsWith(list[i])) {
            return true;
        }
    }
    return false;
}

// 验证代理状态
function testProxy() {
    var url = "http://www.baidu.com";
    try {
        var req = new XMLHttpRequest();
        req.open('HEAD', url, false);
        req.send();
        return req.status >= 200 && req.status < 300;
    } catch (e) {
        return false;
    }
}

// 主函数
function FindProxyForURL(url, host) {
    // 检查本地 TLD
    for (var i = 0; i < localTlds.length; i++) {
        if (host.endsWith(localTlds[i])) {
            return direct;
        }
    }

    // 检查是否在需要使用代理的域名列表中
    if (isDomainInList(host, domainsUsingProxy)) {
        if (testProxy()) {
            return proxy;
        } else {
            return direct;
        }
    }

    // 检查是否在中国域名列表中
    if (isDomainInList(host, directDomains)) {
        return direct;
    }

    // 获取 IP 地址
    var ip = dnsResolve(host);
    if (ip) {
        // 检查 IP 是否在中国 IP 段内
        if (isIpInChina(ip)) {
            return direct;
        } else {
            if (testProxy()) {
                return proxy;
            } else {
                return direct;
            }
        }
    }

    // 默认使用代理
    if (testProxy()) {
        return proxy;
    } else {
        return direct;
    }
}
