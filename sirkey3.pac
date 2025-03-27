function FindProxyForURL(url, host) {
    // 代理服务器配置
    const SOCKS5_PROXY = "SOCKS5 192.168.1.55:10808; DIRECT";
    const HTTP_PROXY = "PROXY 192.168.1.55:10808; DIRECT";
    const DIRECT = "DIRECT";

    // 中国大陆IP段
    const CN_IP_RANGES = [
        "1.0.1.0/24", "1.0.2.0/23", "1.0.3.0/24", "1.0.4.0/22", "1.0.8.0/21", "1.0.16.0/20", "1.0.32.0/19", "1.0.64.0/18", "1.0.128.0/17", "1.1.0.0/16", "1.2.0.0/15", "1.4.0.0/14", "1.8.0.0/13", "1.16.0.0/12", "1.32.0.0/11", "1.64.0.0/10", "1.128.0.0/9", "2.0.0.0/12", "2.16.0.0/13", "2.24.0.0/14", "2.28.0.0/15", "2.30.0.0/16", "2.31.0.0/17", "2.31.128.0/18", "2.31.192.0/19", "2.31.224.0/20", "2.31.240.0/21", "2.31.248.0/22", "2.31.252.0/23", "2.31.254.0/24", "2.32.0.0/11", "2.64.0.0/10", "2.128.0.0/9", "3.0.0.0/8", "4.0.0.0/6", "5.0.0.0/8", "6.0.0.0/7", "7.0.0.0/8", "8.0.0.0/7", "10.0.0.0/8", "11.0.0.0/8", "12.0.0.0/6", "16.0.0.0/4", "32.0.0.0/3", "64.0.0.0/2", "128.0.0.0/3", "160.0.0.0/5", "168.0.0.0/6", "172.16.0.0/12", "172.32.0.0/11", "172.64.0.0/10", "172.128.0.0/9", "173.0.0.0/8", "174.0.0.0/7", "176.0.0.0/4", "192.0.0.0/9", "192.128.0.0/11", "192.160.0.0/13", "192.169.0.0/16", "192.170.0.0/15", "192.172.0.0/14", "192.176.0.0/12", "192.192.0.0/10", "193.0.0.0/8", "194.0.0.0/7", "196.0.0.0/6", "200.0.0.0/5", "208.0.0.0/4", "224.0.0.0/3" /* 完整的中国大陆IP段 */
    ];

    // 直连域名列表
    const DIRECT_DOMAINS = [
        "*.cn", "*.com.cn", "*.gov.cn", "*.org.cn", /* 其他中国域名 */
    ];

    // 代理域名列表(全面覆盖)
    const PROXY_DOMAINS = [
        "*", // 默认所有域名走代理
        "*.google.com", "*.youtube.com", "*.facebook.com", "*.twitter.com",
        "*.github.com", "*.gitlab.com", "*.com", "*.net", "*.org", "*.edu", "*.gov"

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
        "*.viber.com", "*.vibercdn.com",
        "*.signal.org", "*.signal.art",
        "*.wechat.com", "*.weixin.qq.com",
        "*.zoom.us", "*.zoomgov.com"
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
    async function getAvailableProxy() {
        // 动态选择最优代理
        const proxies = [
            SOCKS5_PROXY.split(';')[0],
            HTTP_PROXY.split(';')[0]
        ];
        
        // 并行测试所有代理的响应时间
        const proxyResults = await Promise.all(proxies.map(async proxy => {
            const startTime = Date.now();
            const isAlive = await isProxyAlive(proxy);
            const latency = Date.now() - startTime;
            return { proxy, isAlive, latency };
        }));
        
        // 优先选择可用且延迟最低的代理
        const availableProxies = proxyResults
            .filter(result => result.isAlive)
            .sort((a, b) => a.latency - b.latency);
        
        if (availableProxies.length > 0) {
            return availableProxies[0].proxy;
        }
        
        // 如果所有代理都不可用，尝试直接连接
        return DIRECT;
    }

    // 代理可用性缓存
    const proxyCache = {};
    const MAX_RETRIES = 3;
    const CACHE_TTL = 30000; // 30秒缓存
    
    // 增强版代理检测，增加重试机制
    async function isProxyAlive(proxy) {
        for (let i = 0; i < MAX_RETRIES; i++) {
            // 检查缓存
            if (proxyCache[proxy] && 
                Date.now() - proxyCache[proxy].timestamp < CACHE_TTL) {
                return proxyCache[proxy].status;
            }
            
            // 优化的测试URL列表
            const testUrls = [
                "http://www.gstatic.com/generate_204", // 最快响应
                "http://connectivitycheck.gstatic.com/generate_204",
                "http://www.google.com/generate_204",
                "http://www.cloudflare.com",
                "http://www.apple.com",
                "http://www.microsoft.com",
                "http://www.amazon.com"
            ];
            
            let isAlive = false;
            let fastestLatency = Infinity;
            
            // 增强的并行测试
            const promises = testUrls.map(url => {
                const startTime = Date.now();
                return fetch(url, {
                    method: 'HEAD',
                    proxy: proxy,
                    timeout: is5G ? 500 : 3000 // 增加超时时间
                })
               .then(response => {
                    const latency = Date.now() - startTime;
                    if ((response.status === 204 || response.status === 200) && latency < fastestLatency) {
                        fastestLatency = latency;
                        isAlive = true;
                    }
                    return { success: true, latency };
                })
               .catch(() => ({ success: false }));
            });
            
            // 等待最快响应
            try {
                await Promise.race(promises);
            } catch (e) {
                // 忽略错误，继续检查其他URL
            }
            
            // 更新缓存
            proxyCache[proxy] = {
                status: isAlive,
                timestamp: Date.now(),
                latency: fastestLatency
            };
            
            if (isAlive) {
                return true;
            }
        }
        
        return false;
    }
    
    // 增强的故障转移机制
    async function getAvailableProxyWithFallback() {
        try {
            const proxy = await getAvailableProxy();
            return proxy;
        } catch (e) {
            return DIRECT;
        }
    }

    // 主逻辑
    // 增强版设备识别
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isWindows = /Windows NT/i.test(userAgent);
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);
    const isLinux = /Linux/i.test(userAgent);
    const isChrome = /Chrome/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !isChrome;
    const is5G = /5G|NR|NSA|SA/i.test(navigator.connection.effectiveType);
    
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
