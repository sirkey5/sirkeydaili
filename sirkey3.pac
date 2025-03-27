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
    // 扩展中国大陆网络请求直连规则（更全面域名匹配）
    var chinaDomains = [
        "*.cn", "*.gov.cn", "*.edu.cn", "*.com.cn", 
        "*.net.cn", "*.org.cn", "*.mil.cn", "*.ac.cn"
    ];
    
    // 全球流量强制代理规则
    var globalProxyConditions = [
        shExpMatch(url, "/api/.*"), // API请求强制代理
        shExpMatch(url, "/*.mp4"),  // 大文件下载代理
        shExpMatch(host, ".*\.google\.com"), // 谷歌服务代理
        shExpMatch(host, ".*\.amazon\.com")  // 亚马逊服务代理
    ];
    
    // 检查是否为中国大陆流量（IP+域名双重验证）
    var isChinaIP = false;
    try {
        var resolvedIP = dnsResolve(host);
        isChinaIP = isInNet(resolvedIP, "10.0.0.0", "255.0.0.0") || 
                    isInNet(resolvedIP, "172.16.0.0", "255.240.0.0") || 
                    isInNet(resolvedIP, "192.168.0.0", "255.255.0.0") || 
                    isInNet(resolvedIP, "202.0.0.0", "255.255.255.0");
    } catch(e) {
        console.log("DNS解析失败: " + host);
    }
    
    // 分流逻辑优化
    if (isChinaIP || 
        shExpMatch(host, ".") || 
        shExpMatch(host, ".local") || 
        shExpMatch(url, "localhost") || 
        shExpMatch(url, "127.0.0.1") || 
        shExpMatch(url, "file://") || 
        shExpMatch(url, "chrome-extension://")) {
        return false; // 直连国内及本地流量
    }
    
    // 全球流量强制代理
    if (globalProxyConditions.some(condition => condition(url, host))) {
        return true;
    }
    
    // 其他情况尝试代理
    return true;
}
