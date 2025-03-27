function FindProxyForURL(url, host) {
    // 代理服务器配置
    const SOCKS5_PROXY = "SOCKS5 192.168.1.55:10808; SOCKS 192.168.1.55:10808; DIRECT";
    const HTTP_PROXY = "PROXY 192.168.1.55:10808; DIRECT";
    const DIRECT = "DIRECT";

    // 中国大陆IP段
    const CN_IP_RANGES = [
        "1.0.1.0/24", "1.0.2.0/23", /* 其他中国大陆IP段 */
    ];

    // 直连域名列表
    const DIRECT_DOMAINS = [
        "*.cn", "*.com.cn", "*.gov.cn", "*.org.cn", /* 其他中国域名 */
    ];

    // 代理域名列表
    const PROXY_DOMAINS = [
        "*.google.com", "*.youtube.com", "*.facebook.com", /* 其他国际域名 */
    ];

    // 移动应用专用域名(优化版)
    const MOBILE_APP_DOMAINS = [
        "*.tiktok.com", "*.tiktokv.com", "*.tiktokcdn.com",
        "*.whatsapp.com", "*.whatsapp.net",
        "*.instagram.com", "*.cdninstagram.com",
        "*.facebook.com", "*.fbcdn.net",
        "*.twitter.com", "*.twimg.com",
        "*.snapchat.com", "*.sc-cdn.net",
        "*.telegram.org", "*.t.me",
        "*.line.me", "*.line-apps.com",
        "*.discord.com", "*.discordapp.com",
        "*.viber.com", "*.vibercdn.com"
    ];

    // 检查IP是否在中国大陆
    function isCNIP(ip) {
        return CN_IP_RANGES.some(range => isInNet(ip, range.split('/')[0], range.split('/')[1]));
    }

    // 检查是否为直连域名
    function isDirectDomain(host) {
        return DIRECT_DOMAINS.some(domain => shExpMatch(host, domain));
    }

    // 检查是否为代理域名
    function isProxyDomain(host) {
        return PROXY_DOMAINS.some(domain => shExpMatch(host, domain)) || 
               MOBILE_APP_DOMAINS.some(domain => shExpMatch(host, domain));
    }

    // 智能代理检测与故障转移
    function getAvailableProxy() {
        // 优先SOCKS5代理
        if (isProxyAlive(SOCKS5_PROXY.split(';')[0])) {
            return SOCKS5_PROXY;
        }
        // 其次HTTP代理
        if (isProxyAlive(HTTP_PROXY.split(';')[0])) {
            return HTTP_PROXY;
        }
        // 最后尝试备用代理
        if (isProxyAlive(SOCKS5_PROXY.split(';')[1])) {
            return SOCKS5_PROXY.split(';')[1];
        }
        return DIRECT;
    }

    // 增强版代理检测
    function isProxyAlive(proxy) {
        try {
            // 添加实际网络请求检测代理可用性
            const testUrl = "http://www.google.com/generate_204";
            const startTime = new Date().getTime();
            const response = fetch(testUrl, {
                method: 'HEAD',
                proxy: proxy,
                timeout: 3000
            });
            const latency = new Date().getTime() - startTime;
            return response.status === 204 && latency < 2000;
        } catch (e) {
            return false;
        }
    }

    // 主逻辑
    // 添加移动设备识别
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isPlainHostName(host) || host === 'localhost') {
        return DIRECT;
    }
    
    // 移动设备优先使用SOCKS5代理
    if (isMobile && isProxyDomain(host)) {
        const proxy = SOCKS5_PROXY.split(';')[0];
        if (isProxyAlive(proxy)) {
            return proxy;
        }
    }

    // 内网地址直连
    const ip = dnsResolve(host);
    if (isInNet(ip, "10.0.0.0", "255.0.0.0") || 
        isInNet(ip, "172.16.0.0", "255.240.0.0") || 
        isInNet(ip, "192.168.0.0", "255.255.0.0")) {
        return DIRECT;
    }

    // 中国大陆IP或域名直连
    if (isCNIP(ip) || isDirectDomain(host)) {
        return DIRECT;
    }

    // 国际域名或移动应用域名走代理
    if (isProxyDomain(host)) {
        return getAvailableProxy();
    }

    // 默认情况
    return DIRECT;
}
