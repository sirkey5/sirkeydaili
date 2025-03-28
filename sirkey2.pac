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

    // 异步检测代理是否可用
    function isProxyAvailable() {
        if (proxyCache !== null) return proxyCache;

        // 异步检测逻辑（在PAC文件中受限，但作为示例）
        proxyCache = false; // 默认值
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", proxyTestUrl, true); // 异步请求
            xhr.onload = function () {
                proxyCache = xhr.status === 200;
            };
            xhr.onerror = function () {
                proxyCache = false;
            };
            xhr.send();
        } catch (e) {
            proxyCache = false;
        }
        return proxyCache; // 初始状态可能不稳定，但后续会更新缓存
    }

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

    // 根据设备类型调整逻辑
    function getDeviceType() {
        // 假设通过User-Agent或其他标识检测设备类型
        if (url.indexOf("mobile") !== -1) return "MOBILE";
        return "DESKTOP";
    }

    // 主逻辑
    const resolvedIP = dnsResolve(host);
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);
    const deviceType = getDeviceType();

    // 检测代理可用性（优化：在主逻辑中使用缓存结果）
    const proxyAvailable = isProxyAvailable();
    if (!proxyAvailable) return direct;

    // 国内外请求分流与多协议支持
    if (isChina) {
        return direct; // 中国大陆请求，直接连接
    } else {
        return isHttpsRequest(url)
            ? (deviceType === "MOBILE" ? socksProxy : httpProxy) // HTTPS请求与设备类型选择代理协议
            : httpProxy; // 默认HTTP代理
    }
}
