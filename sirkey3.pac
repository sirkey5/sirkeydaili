function FindProxyForURL(url, host) {
    // 直连策略：本地网络、局域网地址
    if (
        isPlainHostName(host) ||          // 无域名的局域网设备（如打印机）
        dnsDomainIs(host, "local") ||     // 本地服务发现域名（如 .local）
        isInNet(host, "192.168.1.0", "255.255.255.0") || // 192.168.1.0/24 局域网段
        isInNet(host, "10.0.0.0", "255.0.0.0") || // 可选：扩展 10.0.0.0/8 局域网段
        isInNet(host, "172.16.0.0", "255.240.0.0")  // 可选：扩展 172.16.0.0/12 局域网段
    ) {
        return "DIRECT"; // 直连
    }

    // 主代理策略：多协议支持，失败自动切换直连
    return "PROXY 192.168.1.55:10808; SOCKS5 192.168.1.55:10808; DIRECT";
}
