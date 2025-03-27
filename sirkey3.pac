// PAC配置文件 - 2025-03-28 优化版
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER = "SOCKS5 192.168.1.55:10808; DIRECT"; // 主代理+自动回退

    // === 中国直连规则 ===
    const CN_DOMAINS = [
        "cn", "com.cn", "gov.cn", "edu.cn", "org.cn", "net.cn", 
        "mil.cn", "ac.cn", "ah.cn", "bj.cn", "cq.cn", "fj.cn", 
        "gd.cn", "gs.cn", "gz.cn", "ha.cn", "hb.cn", "he.cn", 
        "hi.cn", "hk.cn", "hl.cn", "hn.cn", "jl.cn", "js.cn", 
        "jx.cn", "ln.cn", "nm.cn", "nx.cn", "qh.cn", "sc.cn", 
        "sd.cn", "sh.cn", "sx.cn", "tj.cn", "tw.cn", "xj.cn", 
        "xz.cn", "yn.cn", "zj.cn", "mo.cn", "mac.cn"
    ];

    // === 内网直连规则 ===
    if (
        isPlainHostName(host) || 
        shExpMatch(host, "192.168.*") || 
        shExpMatch(host, "10.*") || 
        shExpMatch(host, "172.16.* - 172.31.*") || 
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.internal") || 
        shExpMatch(host, "*.intranet") || 
        shExpMatch(host, "*.home") || 
        shExpMatch(host, "*.lan")
    ) {
        return "DIRECT";
    }

    // === 中国域名直连 ===
    for (var i = 0; i < CN_DOMAINS.length; i++) {
        if (dnsDomainIs(host, CN_DOMAINS[i])) {
            return "DIRECT";
        }
    }

    // === 手机APP优化规则 ===
    // 特殊APP域名直连（如需添加）
    // if (shExpMatch(host, "*.wechat.com")) return "DIRECT";
    // if (shExpMatch(host, "*.alipay.com")) return "DIRECT";

    // === 全球网络代理 ===
    return PROXY_SERVER;
}
