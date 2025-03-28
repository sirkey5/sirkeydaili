// PAC 文件：优化后的代理自动配置脚本
function FindProxyForURL(url, host) {
    // === 配置区 ===
    // 主代理和备用代理列表（支持多级 failover）
    const proxies = [
        "PROXY 192.168.1.55:10808", // 主代理
        "PROXY 192.168.1.56:10808", // 备用代理 1
        "PROXY 192.168.1.57:10808"  // 备用代理 2
    ];
    const direct = "DIRECT";

    // 中国大陆顶级域名正则表达式
    const chinaTldRegex = /\.(cn|com\.cn|net\.cn|org\.cn|gov\.cn|edu\.cn|mil\.cn|ac\.cn|bj\.cn|sh\.cn)$/i;

    // 中国大陆 IP 段（CIDR 格式，示例）
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
    const chinaIpRangesInt = chinaIpRanges.map(cidrToRange).sort((a, b) => a[0] - b[0]);

    // 二分查找：检查 IP 是否在中国 IP 段内
    function isChinaIp(ip) {
        const ipInt = ipToInt(ip);
        if (ipInt === -1) return false; // 无效 IP，返回 false
        let left = 0, right = chinaIpRangesInt.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const [start, end] = chinaIpRangesInt[mid];
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

    // 获取所有代理配置的字符串（带 failover）
    function getProxyString() {
        return proxies.join("; ") + "; " + direct;
    }

    // === 主逻辑 ===
    try {
        // 判断是否为中国大陆请求
        const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
        const isChinaRequest = isIp ? isChinaIp(host) : isChinaDomain(host);

        // 中国大陆请求走直连，非中国请求走代理（带 failover）
        return isChinaRequest ? direct : getProxyString();
    } catch (e) {
        // 任何异常时，返回直连作为最终 fallback
        return direct;
    }
}