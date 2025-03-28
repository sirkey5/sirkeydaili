function FindProxyForURL(url, host) {
    // 1. 兼容性处理：统一主机名大小写
    host = host.toLowerCase();

    // 2. 局域网/本地流量直连规则（支持 IPv4/IPv6）
    if (
        // 无域名的局域网设备（如 192.168.1.10 或 ::1）
        isPlainHostName(host) ||

        // 本地服务发现域名（.local、.home、.lan）
        (dnsDomainIs(host, "local") || 
         dnsDomainIs(host, "home") || 
         dnsDomainIs(host, "lan")) ||

        // IPv4 局域网段（192.168.1.0/24, 10.0.0.0/8, 172.16.0.0/12）
        (isInNet(host, "192.168.1.0", "255.255.255.0") || 
         isInNet(host, "10.0.0.0", "255.0.0.0") || 
         isInNet(host, "172.16.0.0", "255.240.0.0")) ||

        // IPv6 局域网段（::1, fc00::/7, fe80::/10）
        (isInNetEx(host, "::1", "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff") || 
         isInNetEx(host, "fc00::", "7fff::") || 
         isInNetEx(host, "fe80::", "ff00::"))
    ) {
        return "DIRECT"; // 直接连接
    }

    // 3. 处理 DNS 解析异常
    var hostIP = dnsResolve(host);
    if (hostIP === "0.0.0.0" || hostIP === "::" || hostIP === "") {
        return "SOCKS5 192.168.1.55:10808; " + 
               "SOCKS5 192.168.1.56:10808; " + 
               "PROXY 192.168.1.55:10808; " + 
               "DIRECT";
    }

    // 4. 移动端特殊处理
    if (isMobileDevice()) {
        return "SOCKS5 192.168.1.55:10808; DIRECT";
    }

    // 5. 正常代理策略：SOCKS5 优先，多代理备用
    return "SOCKS5 192.168.1.55:10808; " + 
           "SOCKS5 192.168.1.56:10808; " + 
           "PROXY 192.168.1.55:10808; " + 
           "DIRECT";
}

// 辅助函数：检测移动端（缓存 userAgent）
function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android|blackberry|iemobile/.test(userAgent);
}
