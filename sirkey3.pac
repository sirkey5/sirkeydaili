// PAC配置文件 - 优化手机应用网络访问（剔除台湾、香港、澳门域名，2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER_IP = "192.168.1.55";
    const PROXY_PORT = "10808";
    const PROXY_SERVER = `PROXY ${PROXY_SERVER_IP}:${PROXY_PORT}; DIRECT`;

    const DIRECT = "DIRECT";

    // === 中国域名白名单（严格匹配国内顶级域名） ===
    const CN_DOMAINS = [
        "cn",           // 中国主域名
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
        dnsDomainIs(host, "dns.google") || 
        dnsDomainIs(host, "dns.alidns.com") ||
        dnsDomainIs(host, "cloudflare-dns.com") ||
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
        shExpMatch(host, "*.wechat.com") || 
        shExpMatch(host, "*.weixin.qq.com") || 
        shExpMatch(host, "*.alipay.com") || 
        shExpMatch(host, "*.taobao.com") || 
        shExpMatch(host, "*.tmall.com") || 
        shExpMatch(host, "*.baidu.com") || 
        shExpMatch(host, "*.qq.com") || 
        shExpMatch(host, "*.163.com") || 
        shExpMatch(host, "*.jd.com")
    ) {
        return DIRECT;
    }

    // === 强制代理访问台湾、香港、澳门域名 ===
    if (
        shExpMatch(host, "*.tw") || 
        shExpMatch(host, "*.hk") || 
        shExpMatch(host, "*.mo")
    ) {
        return PROXY_SERVER;
    }

    // === 全球网络强制代理（HTTP/HTTPS兼容） ===
    return PROXY_SERVER;
}
