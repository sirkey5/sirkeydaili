function FindProxyForURL(url, host) {
    // 定义代理服务器列表（优先级从高到低）
    var proxyList = [
        "SOCKS 192.168.1.55:10809", // 主用SOCKS5协议（穿透性强）
        "PROXY 192.168.1.55:10808", // 备用HTTP/HTTPS
        "DIRECT" // 最终回退直连
    ];

    // 手机端强制代理规则（覆盖所有流量）
    var isMobile = /Android|iPhone|iPod/.test(navigator.userAgent);
    if (isMobile) {
        return "PROXY 192.168.1.55:10808; SOCKS 192.168.1.55:10809";
    }

    // 全球流量强制代理规则
    var globalProxyConditions = [
        shExpMatch(url, "/api/.*"), // API请求强制代理
        shExpMatch(url, "/*.mp4"),  // 大文件下载代理
        shExpMatch(host, ".*\.google\.com"), // 谷歌服务代理
        shExpMatch(host, ".*\.amazon\.com")  // 亚马逊服务代理
    ];

    // 中国大陆流量直连规则
    var chinaDomains = [
        "*.cn", "*.gov.cn", "*.edu.cn", "*.com.cn", 
        "*.net.cn", "*.org.cn", "*.mil.cn", "*.ac.cn"
    ];
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

    // 分流逻辑
    if (isChinaIP || 
        shExpMatch(host, ".") || 
        shExpMatch(url, "localhost") || 
        shExpMatch(url, "127.0.0.1") || 
        shExpMatch(url, "file://") || 
        shExpMatch(url, "chrome-extension://")) {
        return false;
    }

    if (globalProxyConditions.some(condition => condition(url, host))) {
        return "PROXY 192.168.1.55:10808; SOCKS 192.168.1.55:10809";
    }

    // 其他情况尝试代理
    return "PROXY 192.168.1.55:10808; SOCKS 192.168.1.55:10809";
}
