// PAC配置文件 - 深度优化手机应用网络访问（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER_IP = "192.168.1.55";
    const PROXY_PORT = "10808";
    const PROXY_SERVER = `PROXY ${PROXY_SERVER_IP}:${PROXY_PORT}; DIRECT`;

    const DIRECT = "DIRECT";

    // === 内网直连规则 ===
    if (
        isPlainHostName(host) || 
        shExpMatch(host, "*.local") || 
        host === "localhost" || 
        host === "127.0.0.1"
    ) {
        return DIRECT;
    }

    // === 内网IP直连 ===
    const ip = dnsResolve(host);
    if (ip) {
        if (
            isInNet(ip, "192.168.0.0", "255.255.0.0") ||
            isInNet(ip, "10.0.0.0", "255.0.0.0") ||
            isInNet(ip, "172.16.0.0", "255.240.0.0") ||
            ip.startsWith("fe80:") ||
            ip.startsWith("fc00:")
        ) {
            return DIRECT;
        }
    }

    // === DNS直连规则 ===
    if (
        dnsDomainIs(host, "dns.google") || 
        dnsDomainIs(host, "dns.alidns.com") || 
        dnsDomainIs(host, "cloudflare-dns.com") || 
        isInNet(ip, "8.8.8.8", "255.255.255.255") || 
        isInNet(ip, "1.1.1.1", "255.255.255.255") || 
        isInNet(ip, "223.5.5.5", "255.255.255.255")
    ) {
        return DIRECT;
    }

    // === 中国域名直连（剔除台湾、香港、澳门） ===
    const CN_DOMAINS = [
        "cn", 
        "localhost", 
        "127.0.0.1"
    ];
    for (const domain of CN_DOMAINS) {
        if (dnsDomainIs(host, domain)) {
            return DIRECT;
        }
    }

    // === 特殊国内应用直连 ===
    if (
        shExpMatch(host, "*.wechat.com") || 
        shExpMatch(host, "*.alipay.com") || 
        shExpMatch(host, "*.taobao.com") || 
        shExpMatch(host, "*.jd.com")
    ) {
        return DIRECT;
    }

    // === 增强的强制代理规则 ===
    if (
        dnsDomainIs(host, "google.com") || 
        dnsDomainIs(host, "youtube.com") || 
        dnsDomainIs(host, "tiktok.com") || 
        shExpMatch(host, "*.google.com") || 
        shExpMatch(host, "*.youtube.com") || 
        shExpMatch(host, "*.tiktok.com") || 
        shExpMatch(host, "*.tw") || 
        shExpMatch(host, "*.hk") || 
        shExpMatch(host, "*.mo")
    ) {
        return PROXY_SERVER;
    }

    // === 处理硬编码IP访问（增强兼容性） ===
    if (ip) {
        if (
            // Google相关IP段
            isInNet(ip, "142.250.0.0", "255.255.0.0") || 
            // YouTube相关IP段
            isInNet(ip, "172.217.0.0", "255.255.0.0") || 
            // TikTok相关IP段（示例）
            isInNet(ip, "192.0.0.0", "255.255.0.0")
        ) {
            return PROXY_SERVER;
        }
    }

    // === 默认强制代理 ===
    return PROXY_SERVER;
}
