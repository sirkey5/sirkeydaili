function FindProxyForURL(url, host) {
    // ======== 核心配置参数 ========
    var MAIN_PROXY = "PROXY 192.168.1.55:10808";       // 主代理（HTTP/HTTPS）
    var BACKUP_PROXY = "SOCKS 192.168.1.55:10809";     // 备用代理（SOCKS5）
    var DIRECT_FALLBACK = "DIRECT";                    // 直连备用

    // ======== 智能分流逻辑 ========
    // 1. 中国大陆流量直连（IP段+域名双重验证）
    function isChinaTraffic(host) {
        try {
            var ip = dnsResolve(host);
            // 中国大陆IP段（IPv4）
            return isInNet(ip, "10.0.0.0", "255.0.0.0") ||
                   isInNet(ip, "114.0.0.0", "255.0.0.0") ||
                   isInNet(ip, "124.0.0.0", "255.0.0.0") ||
                   isInNet(ip, "172.16.0.0", "255.240.0.0") ||
                   isInNet(ip, "192.168.0.0", "255.255.0.0");
        } catch (e) {
            return false;
        }
    }

    // 2. 强制代理规则（手机端+关键服务）
    function mustUseProxy(url, host) {
        // 手机端特征检测（Android/iOS）
        var isMobile = /Android|iPhone|iPod|iPad/.test(navigator.userAgent);
        
        // 关键服务强制代理（API/视频/国际服务）
        var pathRules = [
            shExpMatch(url, "/api/.*"),          // API接口
            shExpMatch(url, "/v2ray/.*"),        // 代理中转服务
            shExpMatch(url, "/*.mp4"),           // 视频流媒体
            shExpMatch(url, "/*.m3u8")           // 视频播放列表
        ];
        
        var domainRules = [
            shExpMatch(host, ".*\\.google\\.com"),      // Google服务
            shExpMatch(host, ".*\\.youtube\\.com"),     // YouTube
            shExpMatch(host, ".*\\.amazonaws\\.com")    // AWS全球服务
        ];

        return isMobile || pathRules.some(rule => rule(url, host)) || 
               domainRules.some(rule => rule(url, host));
    }

    // 3. 中国大陆白名单（本地服务/开发环境）
    function isLocalResource(host) {
        return shExpMatch(host, "localhost") ||
               shExpMatch(host, "127.0.0.1") ||
               shExpMatch(host, ".local") ||
               shExpMatch(host, ".internal");
    }

    // ======== 最终决策逻辑 ========
    // 场景1：强制代理规则优先
    if (mustUseProxy(url, host)) {
        return MAIN_PROXY + "; " + BACKUP_PROXY;
    }

    // 场景2：中国大陆流量直连
    if (isChinaTraffic(host) || isLocalResource(host)) {
        return DIRECT_FALLBACK;
    }

    // 场景3：默认走主代理（自动容灾）
    return MAIN_PROXY + "; " + BACKUP_PROXY + "; " + DIRECT_FALLBACK;
}
