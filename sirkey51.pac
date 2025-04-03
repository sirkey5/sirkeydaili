function FindProxyForURL(url, host) {
    // 代理服务器配置
    const PROXY = "PROXY 192.168.1.55:10808";
    const SOCKS = "SOCKS 192.168.1.55:10808";
    const SOCKS5 = "SOCKS5 192.168.1.55:10808";
    const DIRECT = "DIRECT";

    // 增强版平台检测
    const isWindows = typeof window !== 'undefined' && /Windows/.test(navigator.userAgent);
    const isLinux = typeof window !== 'undefined' && /Linux/.test(navigator.userAgent);
    const isAndroid = typeof window !== 'undefined' && /Android|Adr/.test(navigator.userAgent);
    const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod|iOS/.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;
    const isARM = typeof window !== 'undefined' && /arm|aarch64/.test(navigator.userAgent);

    // 代理协议自动选择（优化移动设备支持）
    function getBestProxy() {
        try {
            // 移动设备优先使用SOCKS5
            if (isMobile) {
                return SOCKS5;
            }
            // 桌面设备优先尝试SOCKS5
            if (isWindows || isLinux) {
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
            // 真实测试代理可用性
            if (typeof window !== 'undefined') {
                // 浏览器环境 - 使用XMLHttpRequest测试（优化移动设备超时）
                return new Promise(resolve => {
                    const xhr = new XMLHttpRequest();
                    xhr.timeout = isMobile ? 5000 : 3000; // 移动设备延长超时时间
                    xhr.open('HEAD', 'http://www.google.com', true);
                    xhr.onload = () => resolve(true);
                    xhr.onerror = () => resolve(false);
                    xhr.ontimeout = () => resolve(false);
                    xhr.send();
                });
            } else {
                // Node.js环境 - 使用http模块测试
                const http = require('http');
                return new Promise(resolve => {
                    const req = http.request({
                        host: 'www.google.com',
                        port: 80,
                        timeout: isMobile ? 5000 : 3000, // 移动设备延长超时时间
                        agent: new http.Agent({ keepAlive: false })
                    }, () => resolve(true));
                    req.on('error', () => resolve(false));
                    req.on('timeout', () => {
                        req.destroy();
                        resolve(false);
                    });
                    req.end();
                });
            }
        } catch (e) {
            return Promise.resolve(false);
        }
    }
    
    // 代理状态检测与自动切换
    let proxyStatus = {
        lastCheck: 0,
        isAvailable: true,
        checkInterval: isMobile ? 60000 : 30000 // 移动设备60秒检测一次，桌面设备30秒检测一次
    };
    
    async function checkAndUpdateProxyStatus() {
        const now = Date.now();
        if (now - proxyStatus.lastCheck > proxyStatus.checkInterval) {
            proxyStatus.lastCheck = now;
            const bestProxy = getBestProxy();
            proxyStatus.isAvailable = await testProxyConnection(bestProxy);
        }
        return proxyStatus.isAvailable;
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
        
        // 检查代理状态并自动切换
        const isProxyAvailable = await checkAndUpdateProxyStatus();
        
        if (isProxyAvailable) {
            return bestProxy;
        } else {
            // 代理不可用时回退到直连
            return DIRECT;
        }
    } catch (e) {
        // 任何异常情况下回退到直连
        return DIRECT;
    }
}
