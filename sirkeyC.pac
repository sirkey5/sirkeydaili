function FindProxyForURL(url, host) {
    const httpProxy = "PROXY 192.168.1.55:10808"; // HTTP代理地址
    const socksProxy = "SOCKS5 192.168.1.55:10808"; // SOCKS5代理地址
    const direct = "DIRECT"; // 直接连接

    // ==== 新增Cloudflare相关配置 ====
    const cloudflareDomains = [
        ".cloudflare.com",
        ".cloudflaressl.com",
        ".cf",
        ".pages.dev",
        ".pages.cloudflare.net",
        ".cloudflare-dns.com"
    ];

    const cloudflareIPRanges = [
        // IPv4范围（示例，需定期更新）
        ["103.21.244.0", "255.255.252.0"], // 103.21.244.0/22
        ["103.22.200.0", "255.255.248.0"], // 103.22.200.0/21
        ["103.31.4.0", "255.255.252.0"], // 103.31.4.0/22
        ["104.16.0.0", "255.240.0.0"], // 104.16.0.0/12
        ["104.244.0.0", "255.252.0.0"], // 104.244.0.0/14
        ["108.162.192.0", "255.255.192.0"], // 108.162.192.0/18
        ["131.0.72.0", "255.255.240.0"], // 131.0.72.0/20
        ["141.101.64.0", "255.255.192.0"], // 141.101.64.0/18
        ["162.158.0.0", "255.255.192.0"], // 162.158.0.0/18
        ["172.64.0.0", "255.192.0.0"], // 172.64.0.0/10
        ["173.245.48.0", "255.255.240.0"], // 173.245.48.0/20
        ["188.114.96.0", "255.255.224.0"], // 188.114.96.0/19
        ["190.93.240.0", "255.255.248.0"], // 190.93.240.0/21
        ["197.234.240.0", "255.255.252.0"], // 197.234.240.0/22
        ["198.41.80.0", "255.255.240.0"], // 198.41.80.0/20

        // IPv6范围（示例，需定期更新）
        ["2400:cb00::", "ffff:ffff:ffff:ffff::/36"],
        ["2405:8100::", "ffff:ffff:ffff:ffff::/36"],
        ["2405:b500::", "ffff:ffff:ffff:ffff::/36"],
        ["2606:4700::", "ffff:ffff:ffff:ffff::/36"]
    ];

    // 判断是否为Cloudflare域名
    function isCloudflareDomain(host) {
        return cloudflareDomains.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断是否为Cloudflare IP
    function isCloudflareIP(ip) {
        if (!ip) return false;
        if (ip.includes(':')) { // IPv6处理
            return cloudflareIPRanges.some(range => {
                const [ipRange, mask] = range;
                return ip.startsWith(ipRange.split('/')[0]);
            });
        } else { // IPv4处理
            return cloudflareIPRanges.some(([ipRange, mask]) => 
                isInNet(ip, ipRange, mask)
            );
        }
    }
    // ==== Cloudflare配置结束 ====

    // 原有中国相关配置
    const chinaDomainSuffixes = [
        ".cn", ".gov.cn", ".edu.cn", ".com.cn", ".org.cn",
        ".net.cn", ".mil.cn", ".taobao", ".jd"
    ];

    const chinaIPRanges = [
        ["1.0.0.0", "255.255.255.0"],   // 1.0.0.0/24
        ["36.0.0.0", "255.255.0.0"],   // 36.0.0.0/16
        ["106.0.0.0", "255.255.0.0"],  // 106.0.0.0/16
        ["115.0.0.0", "255.255.0.0"],  // 115.0.0.0/16
        ["124.0.0.0", "255.255.0.0"],  // 124.0.0.0/16
        ["223.0.0.0", "255.255.255.0"] // 223.0.0.0/24
    ];

    // 判断是否为国内域名
    function isChinaDomain(host) {
        return chinaDomainSuffixes.some(suffix => dnsDomainIs(host, suffix));
    }

    // 判断是否为国内IP
    function isChinaIP(ip) {
        if (!ip) return false;
        if (ip.includes(':')) { // IPv6
            return ip.startsWith("2408") || ip.startsWith("2409");
        }
        return chinaIPRanges.some(([net, mask]) => 
            isInNet(ip, net, mask)
        );
    }

    // 判断是否为HTTPS请求
    function isHttpsRequest(url) {
        return url.startsWith("https://");
    }

    // 主逻辑开始
    const resolvedIP = dnsResolve(host);
    
    // ==== 新增Cloudflare优先判断 ====
    if (isCloudflareDomain(host) || isCloudflareIP(resolvedIP)) {
        return direct; // 直连Cloudflare所有服务
    }

    // 原有中国地区判断
    const isChina = isChinaDomain(host) || isChinaIP(resolvedIP);
    
    if (isChina) {
        return direct; // 国内直连
    } else {
        return isHttpsRequest(url) 
            ? socksProxy // HTTPS使用SOCKS5代理
            : httpProxy; // 其他协议使用HTTP代理
    }
}
