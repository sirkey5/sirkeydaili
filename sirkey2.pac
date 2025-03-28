function FindProxyForURL(url, host) {
    const httpProxy = "PROXY 192.168.1.55:10808"; // HTTP代理地址
    const socksProxy = "SOCKS5 192.168.1.55:10808"; // SOCKS5代理地址
    const direct = "DIRECT"; // 直接连接

    // 动态域名后缀和IP范围（可扩展或从外部加载）
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn", ".taobao", ".jd"
    ];
    const chinaIPRanges = [
        ["1.0.0.0", "255.255.255.0"],   // 1.0.0.0/8
        ["36.0.0.0", "255.255.0.0"],   // 36.0.0.0/16
        ["106.0.0.0", "255.255.0.0"],  // 106.0.0.0/16
        ["115.0.0.0", "255.255.0.0"],  // 115.0.0.0/16
        ["124.0.0.0", "255.255.0.0"],  // 124.0.0.0/16
        ["223.0.0.0", "255.255.255.0"] // 223.0.0.0/24
    ];

    // 检查是否为中国大陆域名
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断 IP 是否属于中国大陆范围（支持IPv6）
    function isChinaIP(ip) {
        if (!ip) return false;
        if (ip.indexOf(":") !== -1) {
            // IPv6地址处理逻辑（简化示例）
            return ip.startsWith("2408") || ip.startsWith("2409");
        }
        return chinaIPRanges.some(range => isInNet(ip, range[0], range[1]));
    }

    // 检查是否为HTTPS请求
    function isHttpsRequest(url) {
        return url.startsWith("https://");
    }

    // 主逻辑
    const resolvedIP = dnsResolve(host);
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);

    // 国内外请求分流与多协议支持
    if (isChina) {
        return direct; // 中国大陆请求，直接连接
    } else {
        return isHttpsRequest(url)
            ? socksProxy // HTTPS请求使用SOCKS5代理
            : httpProxy; // 默认HTTP代理
    }
}



