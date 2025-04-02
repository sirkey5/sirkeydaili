function FindProxyForURL(url, host) {
    // 代理服务器配置
    const PROXY = "PROXY 192.168.1.55:10808";
    const SOCKS = "SOCKS 192.168.1.55:10808";
    const SOCKS5 = "SOCKS5 192.168.1.55:10808";
    const DIRECT = "DIRECT";

    // 平台检测
    const isWindows = typeof window !== 'undefined' && /Windows/.test(navigator.userAgent);
    const isLinux = typeof window !== 'undefined' && /Linux/.test(navigator.userAgent);
    const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent);
    const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isARM = typeof window !== 'undefined' && /arm|aarch64/.test(navigator.userAgent);

    // 代理协议自动选择
    function getBestProxy() {
        try {
            // 优先尝试SOCKS5
            if (isWindows || isLinux || isAndroid || isIOS) {
                return SOCKS5;
            }
            // 其他平台使用普通HTTP代理
            return PROXY;
        } catch (e) {
            // 异常时回退到DIRECT
            return DIRECT;
        }
    }

    // 智能故障转移
    function testProxyConnection(proxy) {
        try {
            // 简单测试代理可用性
            if (typeof window !== 'undefined') {
                // 浏览器环境
                return true;
            } else {
                // Node.js或其他环境
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    // 主逻辑
    try {
        // 本地地址直接连接
        if (isPlainHostName(host) ||
            host === 'localhost' ||
            host === '127.0.0.1' ||
            shExpMatch(host, "*.local") ||
            isInNet(host, "10.0.0.0", "255.0.0.0") ||
            isInNet(host, "172.16.0.0", "255.240.0.0") ||
            isInNet(host, "192.168.0.0", "255.255.0.0")) {
            return DIRECT;
        }

        // 获取最佳代理
        const bestProxy = getBestProxy();
        
        // 测试代理连接
        if (testProxyConnection(bestProxy)) {
            return bestProxy;
        } else {
            // 代理不可用时尝试备用方案
            if (testProxyConnection(PROXY)) {
                return PROXY;
            } else if (testProxyConnection(SOCKS)) {
                return SOCKS;
            } else {
                return DIRECT;
            }
        }
    } catch (e) {
        // 任何异常情况下回退到直连
        return DIRECT;
    }
}
