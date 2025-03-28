function FindProxyForURL(url, host) {
    const httpProxy = "PROXY 192.168.1.55:10808"; // HTTP代理地址
    const socksProxy = "SOCKS5 192.168.1.55:10808"; // SOCKS5代理地址
    const direct = "DIRECT"; // 直接连接

    // 测试代理可用性地址
    const proxyTestUrl = "http://connectivitycheck.platform365.io/pacproxytest";

    // 动态域名后缀和IP范围（可扩展或从外部加载）
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn", ".taobao", ".jd"
    ];
    const chinaIPRanges = [
        ["1.0.0.0", "1.255.255.255"],
        ["36.0.0.0", "36.255.255.255"],
        ["106.0.0.0", "106.255.255.255"],
        ["115.0.0.0", "115.255.255.255"],
        ["124.0.0.0", "124.255.255.255"],
        ["223.0.0.0", "223.255.255.255"]
    ];

    // 缓存机制
    let proxyCache = null;

    // 同步检测代理可用性（PAC文件需同步逻辑）
    function isProxyAvailable() {
        if (proxyCache !== null) return proxyCache;

        try {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 5000; // 设置超时时间[8](@ref)
            xhr.open("GET", proxyTestUrl, false); // 同步请求
            xhr.send();
            proxyCache = xhr.status === 200;
        } catch (e) {
            proxyCache = false;
        }
        return proxyCache;
    }

    // 检查是否为中国大陆域名（修正函数名）
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => host.endsWith(suffix));
    }

    // 判断 IP 是否属于中国大陆范围（支持IPv6）
    function isChinaIP(ip) {
        if (!ip) return false;
        if (ip.includes(":")) {
            // IPv6地址处理逻辑（扩展常见范围）
            return ip.startsWith("2408") || ip.startsWith("2409") || ip.startsWith("2001");
        }
        return chinaIPRanges.some(range => {
            const [start, end] = range.map(Number);
            const ipNum = ipToNumber(ip);
            return ipNum >= start && ipNum <= end;
        });
    }

    // IP转数字辅助函数
    function ipToNumber(ip) {
        return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0);
    }

    // 检查是否为HTTPS请求
    function isHttpsRequest(url) {
        return url.startsWith("https://");
    }

    // 根据设备类型调整逻辑（改进检测方式）
    function getDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        return /mobile|android|iphone|ipad/i.test(ua) ? "MOBILE" : "DESKTOP";
    }

    // 主逻辑
    let resolvedIP = dnsResolve(host);
    if (!resolvedIP) return direct; // 添加DNS解析失败处理

    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);
    const deviceType = getDeviceType();

    // 检测代理可用性（优化：同步逻辑确保检测完成）
    const proxyAvailable = isProxyAvailable();
    if (!proxyAvailable) return direct;

    // 国内外请求分流与多协议支持（增强代理配置）
    if (isChina) {
        return direct;
    } else {
        return isHttpsRequest(url)
            ? `${socksProxy}; ${httpProxy}` // 返回多个代理并指定优先级[1,2](@ref)
            : httpProxy;
    }
}
