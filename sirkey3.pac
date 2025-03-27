// PAC配置文件 - 统一端口10808版（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER_IP = "192.168.1.55"; // 代理服务器IP
    const PROXY_PORT = "10808";            // 统一端口
    const PROXY_SERVER = `SOCKS5 ${PROXY_SERVER_IP}:${PROXY_PORT}; PROXY ${PROXY_SERVER_IP}:${PROXY_PORT}; DIRECT`;
    const DIRECT = "DIRECT";

    // === 中国域名直连规则 ===
    const CN_DOMAINS = ["cn"];

    // === 内网直连规则 ===
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

    // === DNS 服务器直连 ===
    if (
        dnsDomainIs(host, "dns.google") || 
        shExpMatch(host, "8.8.8.8") || 
        shExpMatch(host, "8.8.4.4") || 
        shExpMatch(host, "223.5.5.5") // 阿里DNS
    ) {
        return DIRECT;
    }

    // === 中国域名直连 ===
    for (const domain of CN_DOMAINS) {
        if (dnsDomainIs(host, domain)) {
            return DIRECT;
        }
    }

    // === 特殊APP直连规则 ===
    if (
        shExpMatch(host, "*.wechat.com") || 
        shExpMatch(host, "*.alipay.com") || 
        shExpMatch(host, "*.taobao.com") || 
        shExpMatch(host, "*.baidu.com")
    ) {
        return DIRECT;
    }

    // === 全球网络代理（SOCKS5优先） ===
    return PROXY_SERVER;
}
