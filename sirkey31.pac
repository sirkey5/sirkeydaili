function FindProxyForURL(url, host) {
    // === 配置区 ===
    const proxy = "PROXY 192.168.1.55:10808";
    const direct = "DIRECT";

    // 中国大陆顶级域名正则表达式（扩展：增加 .gov 等）
    const chinaTldRegex = /\.(cn|com\.cn|gov|edu|net|org|gov.cn|edu.cn|com|net.cn|org.cn)$/i;

    // 动态DNS域名直连白名单（如 dynv6.net）
    const directDomains = [
        "*.dynv6.net",
        "dash.cloudflare.com",
        "*.dash.cloudflare.com"
    ];

    // Cloudflare IP段（从官方获取最新列表）
    const cloudflareIpRanges = [
        "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
        "104.16.0.0/12", "108.162.192.0/18", "131.0.72.0/22",
        "141.101.64.0/18", "162.158.0.0/15", "172.64.0.0/13",
        "173.245.48.0/20", "188.114.96.0/20", "190.93.240.0/20",
        "197.234.240.0/22", "198.41.128.0/17"
    ];

    // 中国大陆IP段（需从权威来源获取完整列表）
    const chinaIpRanges = [
        "1.0.0.0/24", "14.0.0.0/22", "58.14.0.0/15",
        "111.0.0.0/16", "114.34.0.0/16", "117.0.0.0/8",
        "120.0.0.0/14", "122.0.0.0/14", "124.0.0.0/14"
    ];

    // === 工具函数 ===
    function ipToInt(ip) {
        try {
            const octets = ip.split('.');
            if (octets.length !== 4) return -1;
            return octets.reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
        } catch (e) {
            return -1;
        }
    }

    function cidrToRange(cidr) {
        try {
            const [ip, mask] = cidr.split('/');
            const ipInt = ipToInt(ip);
            if (ipInt === -1) return [0, 0];
            const maskInt = ~((1 << (32 - mask)) - 1);
            return [ipInt & maskInt, ipInt | ~maskInt];
        } catch (e) {
            return [0, 0];
        }
    }

    const cloudflareIpRangesInt = cloudflareIpRanges.map(cidrToRange).sort((a, b) => a[0] - b[0]);
    const chinaIpRangesInt = chinaIpRanges.map(cidrToRange).sort((a, b) => a[0] - b[0]);

    function isIpInRanges(ip, ranges) {
        const ipInt = ipToInt(ip);
        if (ipInt === -1) return false;
        let left = 0, right = ranges.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const [start, end] = ranges[mid];
            if (ipInt >= start && ipInt <= end) return true;
            if (ipInt < start) right = mid - 1;
            else left = mid + 1;
        }
        return false;
    }

    // === 主逻辑 ===
    try {
        // 检查是否为直连白名单域名
        for (const domain of directDomains) {
            if (shExpMatch(host, domain)) {
                return direct;
            }
        }

        // 判断是否为IP地址
        const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
        
        if (isIp) {
            // 直接访问IP地址时，强制直连（避免证书问题）
            return direct;
        }

        // 检查是否为中国域名
        if (chinaTldRegex.test(host)) {
            return direct;
        }

        // 检查是否为Cloudflare IP段（需通过域名解析后的IP判断）
        // 但PAC脚本无法直接获取目标IP，需通过DNS预解析或IP白名单处理（此处简化逻辑）
        // （注：PAC脚本无法直接获取目标IP，因此需通过域名模式或IP段匹配）

        // 默认走代理，失败时回退直连
        return proxy + "; " + direct;
    } catch (e) {
        return direct;
    }
}
