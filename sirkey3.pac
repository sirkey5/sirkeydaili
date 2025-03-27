// PAC配置文件 - 优化版（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER_IP = "192.168.1.55";
    const PROXY_PORT = "10808";
    const PROXY_SERVER = `SOCKS5 ${PROXY_SERVER_IP}:${PROXY_PORT}; PROXY ${PROXY_SERVER_IP}:${PROXY_PORT}`;
    const DIRECT = "DIRECT";

    // === 中国域名直连规则（扩展版） ===
    const CN_DOMAINS = [
        "cn",             // 主域名
        "com.cn",         // 企业域名
        "gov.cn",         // 政府域名
        "org.cn",         // 组织域名
        "net.cn",         // 网络域名
        "edu.cn",         // 教育域名
        "mil.cn",         // 军事域名
        "hk",             // 香港
        "mo",             // 澳门
        "tw",             // 台湾
        "localhost",      // 本地域名
        "127.0.0.1"       // 本地IP
    ];

    // === 内网直连规则（优先级最高） ===
    if (
        isPlainHostName(host) || // 直接IP或无域名主机
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.internal") || 
        shExpMatch(host, "*.intranet") || 
        shExpMatch(host, "*.home") || 
        shExpMatch(host, "*.lan") || 
        shExpMatch(host, "localhost") || 
        shExpMatch(host, "127.0.0.1")
    ) {
        return DIRECT;
    }

    // === 内网IP直连（修复逻辑） ===
    if (
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0") || // 内网IP段
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") || 
        isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0")
    ) {
        return DIRECT;
    }

    // === DNS 服务器直连（优化匹配逻辑） ===
    if (
        dnsDomainIs(host, "dns.google") || 
        isInNet(dnsResolve(host), "8.8.8.8", "255.255.255.255") || // Google DNS
        isInNet(dnsResolve(host), "8.8.4.4", "255.255.255.255") || 
        isInNet(dnsResolve(host), "223.5.5.5", "255.255.255.255") || // 阿里DNS
        isInNet(dnsResolve(host), "114.114.114.114", "255.255.255.255") // 114DNS
    ) {
        return DIRECT;
    }

    // === 中国域名直连（精确匹配） ===
    for (const domain of CN_DOMAINS) {
        if (dnsDomainIs(host, domain)) {
            return DIRECT;
        }
    }

    // === 特殊APP直连规则（扩展并优化） ===
    if (
        // 国内核心应用
        shExpMatch(host, "*.wechat.com") || 
        shExpMatch(host, "*.weixin.qq.com") || // 微信主域名
        shExpMatch(host, "*.alipay.com") || 
        shExpMatch(host, "*.taobao.com") || 
        shExpMatch(host, "*.tmall.com") || 
        shExpMatch(host, "*.sina.com.cn") || 
        shExpMatch(host, "*.baidu.com") || 
        shExpMatch(host, "*.qq.com") || 
        shExpMatch(host, "*.sohu.com") || 
        shExpMatch(host, "*.163.com") || 
        shExpMatch(host, "*.jd.com") || // 京东

        // 国际应用直连（确保APP能访问）
        shExpMatch(host, "*.tiktok.com") || 
        shExpMatch(host, "*.youtube.com") || 
        shExpMatch(host, "*.tiktokcdn.com") || 
        shExpMatch(host, "*.googlevideo.com") || 
        shExpMatch(host, "*.instagram.com") || 
        shExpMatch(host, "*.facebook.com") || 
        shExpMatch(host, "*.twitter.com")
    ) {
        return DIRECT;
    }

    // === 全球网络代理（SOCKS5优先） ===
    return PROXY_SERVER;
}
