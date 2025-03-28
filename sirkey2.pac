function FindProxyForURL(url, host) {
    const httpProxy = "PROXY 192.168.1.55:10808"; // HTTP代理地址
    const socksProxy = "SOCKS5 192.168.1.55:10808"; // SOCKS5代理地址
    const direct = "DIRECT"; // 直接连接

    // 测试代理可用性地址（确保地址可靠）
    const proxyTestUrl = "http://connectivitycheck.platform365.io/pacproxytest";

    // 缓存机制
    let proxyCache = null;

    // 检测代理是否可用
    function isProxyAvailable() {
        if (proxyCache !== null) return proxyCache;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", proxyTestUrl, false); // 同步请求
            xhr.send();
            proxyCache = xhr.status === 200;
        } catch (e) {
            proxyCache = false;
        }
        return proxyCache;
    }

    // 判断是否为中国大陆域名
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn", ".taobao", ".jd"
    ];
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断 IP 是否属于中国大陆范围
    const chinaIPRanges = [
        ["1.0.0.0", "1.255.255.255"],
        ["36.0.0.0", "36.255.255.255"],
        ["106.0.0.0", "106.255.255.255"],
        ["115.0.0.0", "115.255.255.255"],
        ["124.0.0.0", "124.255.255.255"],
        ["223.0.0.0", "223.255.255.255"]
    ];
    function isChinaIP(ip) {
        if (!ip) return false;
        return chinaIPRanges.some(range => isInNet(ip, range[0], range[1]));
    }

    // 检查是否为HTTPS请求
    function isHttpsRequest(url) {
        return url.startsWith("https://");
    }

    // 根据设备类型调整逻辑
    function getDeviceType() {
        // 假设有环境变量或特定的URL提示设备类型
        if (url.indexOf("mobile") !== -1) return "MOBILE";
        return "DESKTOP";
    }

    // 主逻辑
    const resolvedIP = dnsResolve(host);
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);
    const deviceType = getDeviceType();

    // 检测代理可用性
    if (!isProxyAvailable()) return direct;

    // 根据网络环境和目标类型选择代理策略
    if (isChina) {
        return direct; // 对于中国大陆请求，直接连接
    } else {
        // 对于非中国大陆请求，根据协议类型选择代理
        if (isHttpsRequest(url)) {
            return deviceType === "MOBILE" ? socksProxy : httpProxy; // 移动端优先使用SOCKS5代理
        } else {
            return httpProxy;
        }
    }
}
