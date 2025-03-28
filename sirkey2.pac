function FindProxyForURL(url, host) {
    const proxy = "PROXY 192.168.1.55:10808"; // 代理服务器地址和端口
    const direct = "DIRECT"; // 直接连接

    // 定义测试代理可用性的 HTTP 请求地址（需保证地址可靠）
    const proxyTestUrl = "http://connectivitycheck.platform365.io/pacproxytest";

    // 检测代理是否可用（使用缓存以减少重复请求）
    let proxyAvailableCache = null;
    function isProxyAvailable() {
        if (proxyAvailableCache !== null) {
            return proxyAvailableCache;
        }
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", proxyTestUrl, false); // 同步请求
            xhr.send();
            proxyAvailableCache = xhr.status === 200;
        } catch (e) {
            proxyAvailableCache = false;
        }
        return proxyAvailableCache;
    }

    // 判断是否为中国大陆域名（提升效率）
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn"
    ];
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断 IP 是否属于中国大陆范围
    const chinaIPRanges = [
        ["1.0.0.0", "1.0.0.255"],
        ["36.0.0.0", "36.255.255.255"],
        ["106.0.0.0", "106.255.255.255"],
        ["115.0.0.0", "115.255.255.255"],
        ["124.0.0.0", "124.255.255.255"],
        ["223.0.0.0", "223.255.255.255"]
    ];
    function isChinaIP(ip) {
        return chinaIPRanges.some(range => isInNet(ip, range[0], range[1]));
    }

    // 主逻辑：根据域名或 IP 地址判断并选择代理
    const resolvedIP = dnsResolve(host);
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);

    if (isChina) {
        // 中国大陆请求
        return isProxyAvailable() ? proxy : direct;
    } else {
        // 非中国大陆请求
        return isProxyAvailable() ? proxy : direct;
    }
}
