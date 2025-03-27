// PAC配置文件 - SOCKS5优先版（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER = "SOCKS5 192.168.1.55:10808; PROXY 192.168.1.55:10808; DIRECT";
    const DIRECT = "DIRECT";

    // === 中国域名直连规则 ===
    const CN_DOMAINS = ["cn", "localhost", "127.0.0.1"];

    // === 内网直连规则 ===
    if (
        isPlainHostName(host) || // 直接 IP 或无域名主机
        shExpMatch(host, "192.168.*") || 
        shExpMatch(host, "10.*") || 
        (shExpMatch(host, "172.1[6-9].*") || shExpMatch(host, "172.[2-3][0-9].*")) || 
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.internal") || 
        shExpMatch(host, "*.intranet") || 
        shExpMatch(host, "*.home") || 
        shExpMatch(host, "*.lan") || 
        dnsDomainIs(host, "localhost")
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
        shExpMatch(host, "*.163.com") || 
        shExpMatch(host, "*.sina.com.cn") || 
        shExpMatch(host, "*.baidu.com") || 
        shExpMatch(host, "*.qq.com") || 
        shExpMatch(host, "*.sohu.com")
    ) {
        return DIRECT;
    }

    // === 全球网络代理（SOCKS5优先） ===
    return PROXY_SERVER;
}
