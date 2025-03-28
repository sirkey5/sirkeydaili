function FindProxyForURL(url, host) {
    const proxy = "PROXY 192.168.1.55:10808"; // 代理服务器地址和端口
    const direct = "DIRECT"; // 直接连接

    // 测试代理可用性的 HTTP 地址
    const proxyTestUrl = "http://connectivitycheck.platform365.io/pacproxytest";

    // 缓存代理检测结果，减少重复请求
    let isProxyCached = null;

    // 检测代理是否可用
    function isProxyAvailable() {
        if (isProxyCached !== null) {
            return isProxyCached;
        }
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", proxyTestUrl, false); // 同步请求
            xhr.send();
            isProxyCached = xhr.status === 200;
        } catch (e) {
            isProxyCached = false;
        }
        return isProxyCached;
    }

    // 判断是否为中国大陆域名
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn"
    ];
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断 IP 是否为中国大陆范围
    const chinaIPRanges = [
        ["1.0.0.0", "1.255.255.255"],
        ["36.0.0.0", "36.255.255.255"],
        ["106.0.0.0", "106.255.255.255"],
        ["115.0.0.0", "115.255.255.255"],
        ["124.0.0.0", "124.255.255.255"],
        ["223.0.0.0", "223.255.255.255"]
    ];
    function isChinaIP(ip) {
        if (!ip) {
            return false;
        }
        return chinaIPRanges.some(range => isInNet(ip, range[0], range[1]));
    }

    // 主逻辑
    const resolvedIP = dnsResolve(host);
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);

    // 如果代理不可用时，直接返回 DIRECT
    if (!isProxyAvailable()) {
        return direct;
    }

    // 国内外请求分流
    return isChina ? direct : proxy;
}
