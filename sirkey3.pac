function FindProxyForURL(url, host) {
    // 强制所有流量走代理，包括局域网和本地网络
    return "PROXY 192.168.1.55:10808; SOCKS5 192.168.1.55:10808; DIRECT";
}
