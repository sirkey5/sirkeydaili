function FindProxyForURL(url, host) {
    // 定义代理服务器列表（优先级从高到低）
    var proxyList = [
        "PROXY 192.168.1.55:10808; SOCKS 192.168.1.55:10809", // 主代理+备用SOCKS
        "DIRECT" // 最终回退到直连
    ];

    // 自动容灾逻辑（PAC通过返回多个代理实现重试）
    var result = "";
    for (var i = 0; i < proxyList.length; i++) {
        result = proxyList[i];
        if (tryProxy(result, url, host)) {
            break;
        }
    }
    return result;
}

// 辅助函数：检测代理是否可达（基于内置函数模拟）
function tryProxy(proxy, url, host) {
    // 分流中国大陆网络请求（直接连接）
    if (isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") || // 内网IP段
        shExpMatch(host, "*.cn") || shExpMatch(host, "*.gov.cn")) { // 国内域名
        return false;
    }
    
    // 手机APP全球优化（强制代理）
    if (shExpMatch(url, "/mobile/.*") || shExpMatch(url, "api-gateway.")) {
        return true;
    }
    
    // 全球流量走代理
    return true;
}
