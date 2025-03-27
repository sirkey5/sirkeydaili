// PAC配置文件 - 强制国际代理版（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER_IP = "192.168.1.55";
    const PROXY_PORT = "10808";
    const PROXY_SERVER = `SOCKS5 ${PROXY_SERVER_IP}:${PROXY_PORT}; PROXY ${PROXY_SERVER_IP}:${PROXY_PORT}`;
    const DIRECT = "DIRECT";

    // === 中国域名白名单（严格匹配国内顶级域名） ===
    const CN_DOMAINS = [
        "cn",           // 中国主域名
        "hk",           // 香港
        "mo",           // 澳门
        "tw",           // 台湾
        "localhost",    // 本地域名
        "127.0.0.1"     // 本地IP
    ];

    // === 内网直连规则（最高优先级） ===
    if (
        isPlainHostName(host) || // 无域名主机
        shExpMatch(host, "*.local") || // 内部域名
        shExpMatch(host, "*.internal") ||
        shExpMatch(host, "*.intranet") ||
        shExpMatch(host, "*.home") ||
        shExpMatch(host, "*.lan") ||
        host === "localhost" || // 严格匹配本地域名
        host === "127.0.0.1" // 严格匹配本地IP
    ) {
        return DIRECT;
    }

    // === 内网IP直连（修复逻辑漏洞，支持IPv6） ===
    const ip = dnsResolve(host);
    if (ip) {
        if (
            // IPv4 私有地址
            isInNet(ip, "192.168.0.0", "255.255.0.0") ||
            isInNet(ip, "10.0.0.0", "255.0.0.0") ||
            isInNet(ip, "172.16.0.0", "255.240.0.0") ||
            // IPv6 链接本地地址（fe80::/10）
            ip.startsWith("fe80:") ||
            // IPv6 唯一本地地址（fc00::/7）
            ip.startsWith("fc00:")
        ) {
            return DIRECT;
        }
    }

    // === DNS 服务器直连（仅保留必需的公共DNS） ===
    if (
        // 常用公共DNS域名
        dnsDomainIs(host, "dns.google") || 
        dnsDomainIs(host, "dns.alidns.com") ||
        dnsDomainIs(host, "cloudflare-dns.com") ||
        // 公共DNS IP地址
        isInNet(ip, "8.8.8.8", "255.255.255.255") || // Google DNS
        isInNet(ip, "1.1.1.1", "255.255.255.255") || // Cloudflare DNS
        isInNet(ip, "223.5.5.5", "255.255.255.255") // 阿里DNS
    ) {
        return DIRECT;
    }

    // === 中国域名直连（精确匹配顶级域名） ===
    for (const domain of CN_DOMAINS) {
        if (dnsDomainIs(host, domain)) {
            return DIRECT;
        }
    }

    // === 特殊国内应用直连（仅保留核心服务） ===
    if (
        // 国内核心应用（非CN域名但需直连）
        shExpMatch(host, "*.wechat.com") || // 微信（wechat.com 属于 .com 域名）
        shExpMatch(host, "*.weixin.qq.com") || // 微信（qq.com 属于 .com 域名）
        shExpMatch(host, "*.alipay.com") || // 支付宝（alipay.com 属于 .com 域名）
        shExpMatch(host, "*.taobao.com") || // 淘宝（taobao.com 属于 .com 域名）
        shExpMatch(host, "*.tmall.com") || // 天猫（tmall.com 属于 .com 域名）
        shExpMatch(host, "*.baidu.com") || // 百度（baidu.com 属于 .com 域名）
        shExpMatch(host, "*.qq.com") || // 腾讯（qq.com 属于 .com 域名）
        shExpMatch(host, "*.163.com") || // 网易（163.com 属于 .com 域名）
        shExpMatch(host, "*.jd.com") // 京东（jd.com 属于 .com 域名）
    ) {
        return DIRECT;
    }

    // === 全球网络强制代理（SOCKS5优先） ===
    return PROXY_SERVER;
}
