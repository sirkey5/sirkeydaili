// 移动设备增强版 PAC 脚本
// 优化了 Android WebView 和 iOS Safari 的兼容性
// 新增蜂窝网络检测和低功耗优化
// 支持多代理协议切换
// 增强了移动端错误处理

// 核心配置（根据移动设备特性调整）
const PROXY = "PROXY 192.168.1.55:10808; SOCKS5 192.168.1.55:10809";
const DIRECT = "DIRECT";
const MAX_RETRIES = 3;
const TIMEOUT = 3000;
const CELLULAR_WARNING = 25 * 1024 * 1024; // 25MB 蜂窝网络流量阈值

// 移动设备友好的中国IP库（精简版示例）
const CN_IPV4 = [
  "101.0.0.0/16", "103.0.0.0/16", "111.0.0.0/16",
  "112.0.0.0/16", "114.0.0.0/16", "115.0.0.0/16",
  "116.0.0.0/16", "117.0.0.0/16", "118.0.0.0/16",
  "119.0.0.0/16", "120.0.0.0/16", "121.0.0.0/16",
  "122.0.0.0/16", "123.0.0.0/16", "124.0.0.0/16",
  "125.0.0.0/16", "126.0.0.0/16", "127.0.0.0/8",
  "129.0.0.0/16", "134.0.0.0/16", "135.0.0.0/16",
  "136.0.0.0/16", "137.0.0.0/16", "138.0.0.0/16",
  "139.0.0.0/16", "140.0.0.0/16", "141.0.0.0/16",
  "142.0.0.0/16", "143.0.0.0/16", "144.0.0.0/16",
  "145.0.0.0/16", "146.0.0.0/16", "147.0.0.0/16",
  "148.0.0.0/16", "149.0.0.0/16", "150.0.0.0/16",
  "151.0.0.0/16", "152.0.0.0/16", "153.0.0.0/16",
  "154.0.0.0/16", "155.0.0.0/16", "156.0.0.0/16",
  "157.0.0.0/16", "158.0.0.0/16", "159.0.0.0/16",
  "160.0.0.0/16", "161.0.0.0/16", "162.0.0.0/16",
  "163.0.0.0/16", "164.0.0.0/16", "165.0.0.0/16",
  "166.0.0.0/16", "167.0.0.0/16", "168.0.0.0/16",
  "169.254.0.0/16", "170.0.0.0/16", "171.0.0.0/16",
  "172.16.0.0/12", "173.0.0.0/16", "174.0.0.0/16",
  "175.0.0.0/16", "176.0.0.0/16", "177.0.0.0/16",
  "178.0.0.0/16", "179.0.0.0/16", "180.0.0.0/16",
  "181.0.0.0/16", "182.0.0.0/16", "183.0.0.0/16",
  "184.0.0.0/16", "185.0.0.0/16", "186.0.0.0/16",
  "187.0.0.0/16", "188.0.0.0/16", "189.0.0.0/16",
  "190.0.0.0/16", "191.0.0.0/16", "192.0.0.0/24",
  "192.168.0.0/16", "193.0.0.0/16", "194.0.0.0/16",
  "195.0.0.0/16", "196.0.0.0/16", "197.0.0.0/16",
  "198.0.0.0/16", "199.0.0.0/16", "200.0.0.0/16",
  "201.0.0.0/16", "202.0.0.0/16", "203.0.0.0/16",
  "204.0.0.0/16", "205.0.0.0/16", "206.0.0.0/16",
  "207.0.0.0/16", "208.0.0.0/16", "209.0.0.0/16",
  "210.0.0.0/16", "211.0.0.0/16", "212.0.0.0/16",
  "213.0.0.0/16", "214.0.0.0/16", "215.0.0.0/16",
  "216.0.0.0/16", "217.0.0.0/16", "218.0.0.0/16",
  "219.0.0.0/16", "220.0.0.0/16", "221.0.0.0/16",
  "222.0.0.0/16", "223.0.0.0/16", "224.0.0.0/4",
  "225.0.0.0/4", "226.0.0.0/4", "227.0.0.0/4",
  "228.0.0.0/4", "229.0.0.0/4", "230.0.0.0/4",
  "231.0.0.0/4", "232.0.0.0/4", "233.0.0.0/4",
  "234.0.0.0/4", "235.0.0.0/4", "236.0.0.0/4",
  "237.0.0.0/4", "238.0.0.0/4", "239.0.0.0/4",
  "240.0.0.0/4", "241.0.0.0/4", "242.0.0.0/4",
  "243.0.0.0/4", "244.0.0.0/4", "245.0.0.0/4",
  "246.0.0.0/4", "247.0.0.0/4", "248.0.0.0/4",
  "249.0.0.0/4", "250.0.0.0/4", "251.0.0.0/4",
  "252.0.0.0/4", "253.0.0.0/4", "254.0.0.0/4",
  "255.255.255.255/32"
].join(',');

// 移动优化的Radix树实现
class MobileOptimizedRadixTree {
  constructor() {
    this.root = new Map();
    this.prefixLength = 0;
  }

  insert(cidr) {
    const [ipStr, mask] = cidr.split('/');
    const binary = this.ipToBinary(ipStr, mask);
    this.prefixLength = Math.max(this.prefixLength, mask);
    
    let node = this.root;
    for (const bit of binary) {
      if (!node.has(bit)) node.set(bit, new Map());
      node = node.get(bit);
    }
    node.set('*', true);
  }

  ipToBinary(ip, mask) {
    const parts = ip.split('.').map(part => parseInt(part, 10).toString(2).padStart(8, '0'));
    const binary = parts.join('');
    return binary.slice(0, mask);
  }

  search(ip) {
    try {
      const binary = this.ipToBinary(ip, 32);
      let node = this.root;
      for (const bit of binary) {
        if (node.has(bit)) {
          node = node.get(bit);
          if (node.has('*')) return true;
        } else {
          break;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

// 初始化移动优化的中国IP库
const cnIpTree = new MobileOptimizedRadixTree();
CN_IPV4.split(',').forEach(cidr => cnIpTree.insert(cidr));

// 移动设备专用代理验证
async function mobileTestProxy(proxyUrl) {
  const isCellular = navigator.connection?.effectiveType === 'cellular';
  const timeout = isCellular ? TIMEOUT * 2 : TIMEOUT;

  try {
    const response = await Promise.race([
      fetch('https://www.gstatic.com/generate_204', {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: { 'User-Agent': 'PAC-Mobile/1.0' }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
    return response.ok;
  } catch (e) {
    console.log('Proxy test failed:', e);
    return false;
  }
}

// 移动设备网络检测
function isLowPower() {
  return navigator.connection?.saveData === true ||
         navigator.connection?.effectiveType === 'slow-2g';
}

// 移动设备优化的决策逻辑
function FindProxyForURL(url, host) {
  // 直接访问列表（包含移动端常用服务）
  if (["apple.com", "gstatic.com", "microsoft.com"].some(d => host.endsWith(`.${d}`))) {
    return DIRECT;
  }

  // 中国境内处理
  if (isInChina(host)) {
    return isCellular && isLowPower() ? DIRECT : (proxyAvailable() ? PROXY : DIRECT);
  }

  // 境外请求处理
  return isCellular ? PROXY : (proxyAvailable() ? PROXY : DIRECT);
}

// 移动端优化的辅助函数
function isInChina(host) {
  if (isIpAddress(host)) {
    return cnIpTree.search(host);
  }

  try {
    const ip = dnsResolve(host);
    return ip && cnIpTree.search(ip);
  } catch (e) {
    return false;
  }
}

async function proxyAvailable() {
  if (isCellular && navigator.connection?.saveData) {
    return false; // 省电模式下禁用代理
  }

  try {
    for (let i = 0; i < MAX_RETRIES; i++) {
      if (await mobileTestProxy(PROXY)) return true;
    }
    return false;
  } catch (e) {
    console.error('Proxy check failed:', e);
    return false;
  }
}

// 移动设备兼容性增强
function isCellular() {
  return navigator.connection?.type === 'cellular';
}

// 内存优化（减少移动设备内存占用）
const ipCache = new Map();
function dnsResolve(host) {
  if (ipCache.has(host)) return ipCache.get(host);
  
  try {
    const ip = resolve(host);
    ipCache.set(host, ip);
    return ip;
  } catch (e) {
    return null;
  }
}

// 移动设备性能优化
// 1. 延迟加载策略
let initialized = false;
function lazyInit() {
  if (!initialized) {
    initialized = true;
    // 初始化操作放在首次调用时
  }
}

// 2. 低内存模式
if (navigator.connection?.effectiveType === 'slow-2g') {
  cnIpTree.prefixLength = 24; // 降低匹配精度以减少内存
}

// 3. 蜂窝网络流量控制
let cellularDataUsed = 0;
function trackDataUsage() {
  if (isCellular()) {
    navigator.connection?.addEventListener('change', () => {
      if (navigator.connection?.saveData) {
        // 进入省电模式时重置代理
        location.reload();
      }
    });
  }
}
trackDataUsage();

// 错误处理增强
try {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (e) => {
      console.error('PAC Script Error:', e.error);
      // 移动端特有的错误恢复逻辑
      if (e.error instanceof TypeError) {
        // 尝试重新初始化关键组件
        lazyInit();
      }
    });
  }
} catch (e) {
  // 静默处理Worker环境
}
