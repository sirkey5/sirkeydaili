// PAC 文件：优化后的代理自动配置脚本
function FindProxyForURL(url, host) {
    // === 配置区 ===
    // 代理服务器（仅使用您提供的单一代理）
    const proxy = "PROXY 192.168.1.55:10808";
    const direct = "DIRECT";

    // 中国大陆顶级域名正则表达式
    const chinaTldRegex = /\.(cn|com\.cn|net\.cn|org\.cn|gov\.cn|edu\.cn|mil\.cn|ac\.cn|bj\.cn|sh\.cn)$/i;

    // Cloudflare IP 段（示例，需从官方获取完整列表）
    const cloudflareIpRanges = [
        "103.21.244.0/22",
        "103.22.200.0/22",
        "103.31.4.0/22",
        "104.16.0.0/12",
        "108.162.192.0/18",
        "131.0.72.0/22",
        "141.101.64.0/18",
        "162.158.0.0/15",
        "172.64.0.0/13",
        "173.245.48.0/20",
        "188.114.96.0/20",
        "190.93.240.0/20",
        "197.234.240.0/22",
        "198.41.128.0/17"
    ];

    // 中国大陆 IP 段（示例，需从权威来源获取完整列表）
    const chinaIpRanges = [
        "1.0.1.0/24",
        "14.0.0.0/22",
        "58.14.0.0/15"
    ];

    // === 工具函数 ===
    // 将 IP 地址转换为整数
    function ipToInt(ip) {
        try {
            const octets = ip.split('.');
            if (octets.length !== 4) return -1;
            return octets.reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
        } catch (e) {
            return -1;
        }
    }

    // 将 CIDR 转换为 IP 范围
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

    // 预计算 IP 范围（只在初始化时计算一次）
    const cloudflareIpRangesInt = cloudflareIpRanges.map(cidrToRange).sort((a, b) => a[0] - b[0]);
    const chinaIpRangesInt = chinaIpRanges.map(cidrToRange).sort((a, b) => a[0] - b[0]);

    // 二分查找：检查 IP 是否在指定 IP 段内
    function isIpInRanges(ip, ranges) {
        const ipInt = ipToInt(ip);
        if (ipInt === -1) return false; // 无效 IP，返回 false
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

    // 检查是否为中国大陆域名
    function isChinaDomain(host) {
        return chinaTldRegex.test(host);
    }

    // 检查是否为 Cloudflare Dashboard 域名
    function isCloudflareDashboard(host) {
        return host === "dash.cloudflare.com" || host.endsWith(".dash.cloudflare.com");
    }

    // === 主逻辑 ===
    try {
        // 判断主机是否为 IP 地址
        const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);

        // 如果是 IP 地址，检查是否为 Cloudflare IP 或中国 IP
        if (isIp) {
            if (isIpInRanges(host, cloudflareIpRangesInt)) {
                // Cloudflare IP：使用代理，失败时 fallback 到直连
                return proxy + "; " + direct;
            } else if (isIpInRanges(host, chinaIpRangesInt)) {
                // 中国 IP：直连
                return direct;
            } else {
                // 其他 IP：使用代理
                return proxy;
            }
        } else {
            // 如果是域名，检查是否为 Cloudflare Dashboard
            if (isCloudflareDashboard(host)) {
                // Cloudflare Dashboard：强制直连，避免代理干扰
                return direct;
            } else if (isChinaDomain(host)) {
                // 中国域名：直连
                return direct;
            } else {
                // 非中国域名（包括其他 Cloudflare 服务域名）：使用代理，失败时 fallback 到直连
                return proxy + "; " + direct;
            }
        }
    } catch (e) {
        // 任何异常时，返回直连作为最终 fallback
        return direct;
    }
}