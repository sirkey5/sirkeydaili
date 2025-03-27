var proxy = "PROXY 192.168.1.55:10808";
var direct = 'DIRECT';

var directDomains = ["gov.cn","115.com","123pan.com","123957.com","baidu.com","baidupcs.com","baidustatic.com","bdimg.com","bdstatic.com","cdn.bcebos.com","cdnnode.cn","qq.com","weixinbridge.com"];
var domainsUsingProxy = ["google.com.hk","ent.com","youtube.com","googlevideo.com","ytimg.com","github.com","github.io","githubusercontent.com","githubassets.com","bing.com","bing.cn","bing.net"];
var localTlds = [".test",".localhost"];
var cidrs = '15,22,~3,~7,38,43,~c,51,6d,~f,73,92,~e,ac,ba,dc,~e,e1,~5,~7,~9,~d,~f,f6,103,~8,123,~6,~d,13a,177,~b,18a,1b1,~c,1c0,~5,~d,1d1,~2,~6,~6,~9,1e0,~3,~5,241,2a8,~a,~d,~e,2b4,~7,~b,2dc,~f,2e'[...];

function isIpAddress(ip) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) || /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/.test(ip);
}

function RadixTree() {
    this.root = new Map();
}

RadixTree.prototype.insert = function(string) {
    var node = this.root;
    for (var i = 0; i < string.length; i++) {
        var char = string[i];
        if (!node.has(char)) {
            node.set(char, new Map());
        }
        node = node.get(char);
    }
};

RadixTree.prototype.search = function(string) {
    var currentNode = this.root;
    var isLastNode = false;
    for (var i=0; i < string.length; i++) {
        var char = string[i];
        if (currentNode.has(char)) {
            currentNode = currentNode.get(char);
            isLastNode = currentNode.size === 0;
        } else {
            break;
        }
    }
    return isLastNode;
};

function ipToBinary(ip) {
    var bin = ''
    // Check if it's IPv4
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        bin = ip.split('.').map(function(num) {
            return ("00000000" + parseInt(num, 10).toString(2)).slice(-8);
        }).join('');
    } else if (/^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/.test(ip)) {
        // Expand the IPv6 address if it contains '::'
        var parts = ip.split('::');
        var left = parts[0] ? parts[0].split(':') : [];
        var right = parts[1] ? parts[1].split(':') : [];
        
        // Calculate the number of zero groups to insert
        var zeroGroups = 8 - (left.length + right.length);
        
        // Create the full address by inserting zero groups
        var fullAddress = left.concat(Array(zeroGroups + 1).join('0').split('')).concat(right);
        
        // Convert each group to binary and pad to 16 bits
        bin = fullAddress.map(function(group) {
            return ("0000000000000000" + parseInt(group || '0', 16).toString(2)).slice(-16);
        }).join('');
    }
    return bin.replace(/^0+/, '');
}

function isInDirectDomain(host) {
    for (var i = 0; i < directDomains.length; i++) {
        var domain = directDomains[i];
        if (host === domain || host.endsWith('.' + domain)) {
            return true;
        }
    }
    return false;
}

function isInProxyDomain(host) {
    for (var i = 0; i < domainsUsingProxy.length; i++) {
        var domain = domainsUsingProxy[i];
        if (host === domain || host.endsWith('.' + domain)) {
            return true;
        }
    }
    return false;
}

function isLocalTestDomain(domain) {
    // Chrome uses .test as testing gTLD.
    var tld = domain.substring(domain.lastIndexOf('.'));
    if (tld === domain) {
        return false;
    }
    return localTlds.some(function(localTld) {
        return tld === localTld;
    });
}

/* https://github.com/frenchbread/private-ip */
function isPrivateIp(ip) {
    return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^f[cd][0-9a-f]{2}:/i.test(ip) ||
        /^fe80:/i.test(ip) ||
        /^::1$/.test(ip) ||
        /^::$/.test(ip);
}

// Check if the device is mobile
function isMobile() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos/i.test(userAgent);
}

// New function: check if the proxy server is available
function isProxyAvailable() {
    var proxyTestUrl = "http://www.google.com/generate_204";
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", proxyTestUrl, false);
    try {
        xhr.send();
        return (xhr.status >= 200 && xhr.status < 300);
    } catch (e) {
        return false;
    }
}

function FindProxyForURL(url, host) {
    if (isInDirectDomain(host)) {
        debug('命中直连域名', host, 'N/A');
        return direct;
    } else if (isInProxyDomain(host)) {
        debug('命中代理域名', host, 'N/A');
        return isProxyAvailable() ? proxy : direct;
    } else if (isPlainHostName(host) || host === 'localhost' || isLocalTestDomain(host)) {
        debug('命中本地主机名或本地tld', host, 'N/A');
        return direct;
    } else if (isPrivateIp(host)) {
        debug('命中私有 IP 地址', host, 'N/A');
        return direct;
    }

    ip = isIpAddress(host) ? host : dnsResolve(host);

    if (!ip) {
        debug('无法解析 IP 地址', host, 'N/A');
        return isProxyAvailable() ? proxy : direct;
    } else if (isPrivateIp(ip)) {
        debug('域名解析后命中私有 IP 地址', host, ip);
        return direct;
    } else if (radixTree.search(ipToBinary(ip))) {
        debug('匹配到直连IP', host, ip);
        return direct;
    }

    debug('未命中任何规则', host, ip);
    return isProxyAvailable() ? proxy : direct;
}

var allowAlert = true
function debug(msg, host='', ip='') {
    if (!allowAlert) {
        return
    }
    try {
        alert('[' + host + ' -> ' + ip + '] ' + msg);
    } catch (e) {
        allowAlert = false
    }
}

var radixTree = new RadixTree();

(function () {
    debug('开始生成 Radix Tree', 'PAC文件载入开始');
    lastFullPrefix = ''
    for (let i=0; i<cidrs.length; i++) {
        var prefix = cidrs[i];
        if (prefix.substring(0, 1) !== '~') {
            lastFullPrefix = prefix
        } else {
            prefix = lastFullPrefix.substring(0, lastFullPrefix.length-prefix.length+1) + prefix.substring(1)
        }
        var bits = (parseInt(prefix, 16)).toString(2);
        radixTree.insert(bits);
    }
    debug('Radix Tree 已生成', 'PAC文件载入完毕', cidrs.length.toString()+'个CIDR条目');
})();
