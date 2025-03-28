function FindProxyForURL(url, host) {
    // 如果访问本地地址（例如没有点号的主机名或 *.local 域），直接直连
    if (isPlainHostName(host) || dnsDomainIs(host, ".local")) {
        return "DIRECT";
    }
    
    // 首先尝试使用代理服务器
    // 如果 192.168.1.55:10808 可用，所有请求将经由该代理；
    // 如果代理服务器连接失败，则自动回退使用本地直连
    return "PROXY 192.168.1.55:10808; DIRECT";
}
