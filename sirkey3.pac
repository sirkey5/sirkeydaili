// PAC配置文件 - SOCKS5优先版（2025-03-28）
function FindProxyForURL(url, host) {

    // === 定义代理服务器 ===
    const PROXY_SERVER = "SOCKS5 192.168.1.55:10808; PROXY 192.168.1.55:10808; DIRECT"; // 优先尝试SOCKS5，次HTTP，最后直连
    const DIRECT = "DIRECT";

    // === 中国域名直连规则 ===
    const CN_DOMAINS = [
        "cn", "com.cn", "gov.cn", "edu.cn", "org.cn", "net.cn", 
        "mil.cn", "ac.cn", "ah.cn", "bj.cn", "cq.cn", "fj.cn", 
        "gd.cn", "gs.cn", "gz.cn", "ha.cn", "hb.cn", "he.cn", 
        "hi.cn", "hk.cn", "hl.cn", "hn.cn", "jl.cn", "js.cn", 
        "jx.cn", "ln.cn", "nm.cn", "nx.cn", "qh.cn", "sc.cn", 
        "sd.cn", "sh.cn", "sx.cn", "tj.cn", "tw.cn", "xj.cn", 
        "xz.cn", "yn.cn", "zj.cn", "mo.cn", "mac.cn", "hkg.cn", 
        "tpe.cn", "localhost", "127.0.0.1"
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
        shExpMatch(host, "*.lan") || 
        dnsDomainIs(host, "local") || 
        dnsDomainIs(host, "localhost")
    ) {
        return DIRECT;
    }

    // === 中国域名直连 ===
    for (var i = 0; i < CN_DOMAINS.length; i++) {
        if (dnsDomainIs(host, CN_DOMAINS[i])) {
            return DIRECT;
        }
    }

    // === 特殊APP直连规则 ===
    if (
        shExpMatch(host, "*.wechat.com") || 
        shExpMatch(host, "*.alipay.com") || 
        shExpMatch(host, "*.taobao.com") || 
        shExpMatch(host, "*.163.com") || 
        shExpMatch(host, "*.sina.com.cn") || 
        shExpMatch(host, "*.baidu.com") || 
        shExpMatch(host, "*.qq.com") || 
        shExpMatch(host, "*.sohu.com")
    ) {
        return DIRECT;
    }

    // === 全球网络代理（SOCKS5优先） ===
    return PROXY_SERVER;
}
