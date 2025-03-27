/******************** 基础配置 ********************/
// 唯一的 http 代理配置，端口统一为 10808
const httpProxy = "PROXY 192.168.1.55:10808; DIRECT";
// 唯一的 socks5 代理配置，端口统一为 10808
const socks5Proxy = "SOCKS5 192.168.1.55:10808; DIRECT";
// 直连配置
const direct = "DIRECT";

/******************** 多设备多平台优化 ********************/
// 本地顶级域名列表
const localTlds = [".test", ".localhost", ".local", ".home", ".lan"];
// 私有网络地址范围
const privateNetworks = [
    "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16",
    "127.0.0.0/8", "::1/128", "fc00::/7", "fe80::/10"
];

/******************** 行业优化规则（每个分类≥20条） ********************/
// 社交媒体与通讯行业域名列表
const socialMedia = [
    ".weibo.com", ".wechat.com", ".whatsapp.com", ".facebook.com", ".messenger.com",
    ".twitter.com", ".x.com", ".instagram.com", ".tiktok.com", ".linkedin.com",
    ".pinterest.com", ".telegram.org", ".line.me", ".discord.com", ".snapchat.com",
    ".viber.com", ".skype.com", ".signal.org", ".zoom.us", ".slack.com", ".twitch.tv"
];

// 开发者工具与云服务行业域名列表
const devTools = [
    ".github.com", ".gitlab.com", ".docker.com", ".npmjs.com", ".stackoverflow.com",
    ".jetbrains.com", ".postman.com", ".atlassian.com", ".jfrog.com", ".sonatype.com",
    ".kubernetes.io", ".terraform.io", ".vagrantup.com", ".ansible.com", ".puppet.com",
    ".chef.io", ".gradle.org", ".maven.org", ".nuget.org", ".pipelines.azure.com"
];

// 金融行业域名列表
const finance = [
    ".visa.com", ".mastercard.com", ".paypal.com", ".westernunion.com", ".bloomberg.com",
    ".reuters.com", ".nasdaq.com", ".nyse.com", ".londonstockexchange.com", ".xero.com",
    ".quickbooks.com", ".americanexpress.com", ".jpmorgan.com", ".citi.com", ".hsbc.com",
    ".charlesschwab.com", ".fidelity.com", ".vanguard.com", ".blackrock.com", ".creditease.cn"
];

// 教育科研行业域名列表
const education = [
    ".coursera.org", ".edx.org", ".khanacademy.org", ".researchgate.net", ".ieee.org",
    ".springer.com", ".elsevier.com", ".acm.org", ".arxiv.org", ".jstor.org",
    ".mit.edu", ".harvard.edu", ".stanford.edu", ".cambridge.org", ".ox.ac.uk",
    ".nature.com", ".sciencemag.org", ".plos.org", ".wiley.com", ".sagepub.com"
];

// 医疗健康行业域名列表
const healthcare = [
    ".who.int", ".nih.gov", ".mayoclinic.org", ".webmd.com", ".medscape.com",
    ".clinicaltrials.gov", ".drugs.com", ".rxlist.com", ".healthline.com", ".patient.info",
    ".cdc.gov", ".fda.gov", ".ema.europa.eu", ".pfizer.com", ".moderna.com",
    ".astrazeneca.com", ".novartis.com", ".roche.com", ".merck.com", ".medtronic.com"
];

// 娱乐行业域名列表
const entertainment = [
    ".netflix.com", ".hulu.com", ".disneyplus.com", ".amazon.com/primevideo", ".apple.com/tv",
    ".spotify.com", ".deezer.com", ".tidal.com", ".bandcamp.com", ".itunes.apple.com",
    ".imdb.com", ".rottentomatoes.com", ".metacritic.com", ".gamespot.com", ".ign.com",
    ".steamcommunity.com", ".epicgames.com", ".ubisoft.com", ".sonyentertainmentnetwork.com", ".nintendo.com"
];

// 电商行业域名列表
const eCom = [
    ".amazon.com", ".amazon.cn", ".amazon.in", ".ebay.com", ".aliexpress.com",
    ".taobao.com", ".tmall.com", ".jd.com", ".pinduoduo.com", ".walmart.com",
    ".costco.com", ".target.com", ".bestbuy.com", ".newegg.com", ".ikea.com",
    ".zara.com", ".hm.com", ".nike.com", ".adidas.com", ".macys.com"
];

// 新闻媒体行业域名列表
const newsMedia = [
    ".cnn.com", ".bbc.com", ".foxnews.com", ".nytimes.com", ".washingtonpost.com",
    ".wsj.com", ".theguardian.com", ".abcnews.go.com", ".cnbc.com", ".reuters.com",
    ".apnews.com", ".msn.com", ".yandex.ru", ".sina.com.cn", ".sohu.com",
    ".ifeng.com", ".dw.com", ".france24.com", ".rt.com", ".aljazeera.com"
];

// 旅游行业域名列表
const travel = [
    ".booking.com", ".agoda.com", ".expedia.com", ".tripadvisor.com", ".airbnb.com",
    ".kayak.com", ".skyscanner.net", ".travelocity.com", ".priceline.com", ".hotels.com",
    ".carnival.com", ".royalcaribbean.com", ".united.com", ".delta.com", ".americanairlines.com",
    ".vistara.com", ".emirates.com", ".qatarairways.com", ".singaporeair.com", ".lufthansa.com"
];

// 游戏行业域名列表
const gaming = [
    ".riotgames.com", ".blizzard.com", ".mojang.com", ".nintendo.co.jp", ".sony.com",
    ".xbox.com", ".ubisoft.com", ".ea.com", ".rockstargames.com", ".square-enix.com",
    ".ncsoft.com", ".nexon.com", ".netmarble.com", ".kakaogames.com", ".snk.com",
    ".sega.com", ".atlus.com", ".capcom.com", ".namco.com", ".tencentgames.com"
];

// 汽车行业域名列表
const automotive = [
    ".toyota.com", ".honda.com", ".ford.com", ".gm.com", ".volkswagen.com",
    ".bmw.com", ".mercedes-benz.com", ".audi.com", ".tesla.com", ".nissan.com",
    ".hyundai.com", ".kia.com", ".mazda.com", ".subaru.com", ".mitsubishi-motors.com",
    ".fiat.com", ".chrysler.com", ".jeep.com", ".landrover.com", ".porsche.com"
];

// 航空航天行业域名列表
const aerospace = [
    ".boeing.com", ".airbus.com", ".lockheedmartin.com", ".northropgrumman.com", ".raytheon.com",
    ".spacex.com", ".blueorigin.com", ".virgingalactic.com", ".esa.int", ".nasa.gov",
    ".jaxa.jp", ".cnsa.gov.cn", ".roscosmos.ru", ".airfrance.com", ".britishairways.com",
    ".lufthansa.com", ".singaporeair.com", ".qatarairways.com", ".emirates.com", ".delta.com"
];

// 能源行业域名列表
const energy = [
    ".bp.com", ".shell.com", ".exxonmobil.com", ".chevron.com", ".totalenergies.com",
    ".eni.com", ".equinor.com", ".petrochina.com.cn", ".sinopec.com", ".cnooc.com.cn",
    ".gazprom.com", ".eni.com", ".occidentalpetroleum.com", ".conocoPhillips.com", ".schlumberger.com",
    ".halliburton.com", ".bakerhughes.com", ".weatherford.com", ".solarcity.com", ".tesla.com/energy"
];

// 零售行业域名列表
const retail = [
    ".walmart.com", ".target.com", ".costco.com", ".samsclub.com", ".aldi.com",
    ".tesco.com", ".asda.com", ".carrefour.com", ".lidl.com", ".aldi.com",
    ".7-eleven.com", ".circlek.com", ".riteaid.com", ".walgreens.com", ".cvshealth.com",
    ".macys.com", ".nordstrom.com", ".bloomingdales.com", ".sears.com", ".jcpenney.com"
];

// 餐饮行业域名列表
const food = [
    ".mcdonalds.com", ".kfc.com", ".burgerking.com", ".starbucks.com", ".dominos.com",
    ".pizzahut.com", ".subway.com", ".wendys.com", ".tacobell.com", ".dunkindonuts.com",
    ".chipotle.com", ".pandaexpress.com", ".outbacksteakhouse.com", ".olivegarden.com", ".redlobster.com",
    ".mcdonalds.co.uk", ".kfc.co.uk", ".burgerking.co.uk", ".starbucks.co.uk", ".dominos.co.uk"
];

// 时尚行业域名列表
const fashion = [
    ".gucci.com", ".prada.com", ".chanel.com", ".dior.com", ".louisvuitton.com",
    ".hermes.com", ".fendi.com", ".versace.com", ".armani.com", ".valentino.com",
    ".burberry.com", ".calvinklein.com", ".tommyhilfiger.com", ".ralphlauren.com", ".hugo.com",
    ".zara.com", ".hm.com", ".mango.com", ".uniqlo.com", ".gap.com"
];

// 体育行业域名列表
const sports = [
    ".espn.com", ".foxsports.com", ".nba.com", ".nfl.com", ".mlb.com",
    ".nhl.com", ".fifa.com", ".uefa.com", ".olympic.org", ".tennis.com",
    ".golf.com", ".surfing.com", ".skiing.com", ".running.com", ".cycling.com",
    ".athletics.com", ".swimming.com", ".boxing.com", ".wwe.com", ".ufc.com"
];

// 家居行业域名列表
const home = [
    ".ikea.com", ".wayfair.com", ".home depot.com", ".lowes.com", ".bedbathandbeyond.com",
    ".potterybarn.com", ".westelm.com", ".crateandbarrel.com", ".anthropologie.com", ".cb2.com",
    ".restorationhardware.com", ".lululemon.com", ".nordstromrack.com", ".tjmaxx.com", ".marshalls.com",
    ".overstock.com", ".homedepot.ca", ".lowes.ca", ".wayfair.ca", ".ikea.ca"
];

// 教育科技行业域名列表
const edTech = [
    ".udemy.com", ".lynda.com", ".udacity.com", ".skillshare.com", ".teachable.com",
    ".classroom.google.com", ".canvas.instructure.com", ".moodle.org", ".blackboard.com", ".byjus.com",
    ".khanacademy.org", ".coursera.org", ".edx.org", ".pluralsight.com", ".datacamp.com",
    ".codecademy.com", ".treehouse.com", ".freecodecamp.org", ".w3schools.com", ".geeksforgeeks.org"
];

// 物流行业域名列表
const logistics = [
    ".ups.com", ".fedex.com", ".dhl.com", ".tnt.com", ".aramex.com",
    ".postnl.nl", ".dpd.co.uk", ".royalmail.com", ".usps.com", ".canadapost.ca",
    ".singpost.com", ".china-post.com.cn", ".japanpost.jp", ".deutschepost.de", ".poste.it",
    ".correos.es", ".poste.fr", ".swisspost.ch", ".tnt.com", ".gls-group.eu"
];

// 广告营销行业域名列表
const adMarketing = [
    ".google.com/ads", ".facebook.com/business", ".twitter.com/i/ads", ".linkedin.com/marketing-solutions",
    ".snapchat.com/business", ".tiktok.com/business", ".pinterest.com/business", ".youtube.com/ads",
    ".adobe.com/marketing-cloud", ".salesforce.com/products/marketing-cloud", ".hubspot.com",
    ".mailchimp.com", ".constantcontact.com", ".sendinblue.com", ".klaviyo.com",
    ".criteo.com", ".taboola.com", ".outbrain.com", ".appnexus.com", ".rubiconproject.com"
];

// 直连域名列表，按分类注释
const directDomains = [
    // 政府机构
    "gov.cn",
    // 云存储
    "115.com", "123pan.com", "123957.com", "aliyundrive.com", "dropbox.com",
    // 搜索引擎
    "baidu.com", "baidupcs.com", "baidustatic.com", "bdimg.com", "bdstatic.com", "duckduckgo.com"
];

// 缓存DNS解析结果，避免重复解析
const dnsCache = {};
function dnsResolveCached(host) {
    return dnsCache[host] || (dnsCache[host] = dnsResolve(host));
}

// 检查IP地址是否在指定的网络范围内
function isInPrivateNetwork(ip) {
    return privateNetworks.some((network) => {
        const [net, mask] = network.split('/');
        return isInNet(ip, net, parseInt(mask, 10));
    });
}

// 检查主机名是否匹配某个行业的域名列表
function matchIndustryDomain(host, domainGroup) {
    return domainGroup.some((domain) => shExpMatch(host, `*${domain}`));
}

// 缓存代理可用性结果
const proxyAvailabilityCache = {};
// 重试次数
const MAX_RETRIES = 3;
// 记录代理失败次数
let proxyFailureCount = 0;
// 最大代理失败次数，超过该次数则切换到直连
const MAX_PROXY_FAILURES = 3;

// 智能路由判断函数
function FindProxyForURL(url, host) {
    // 内网地址直连
    const ip = dnsResolveCached(host);
    if (isInPrivateNetwork(ip)) {
        return direct;
    }

    // 本地域名直连
    if (localTlds.some((tld) => host.endsWith(tld))) {
        return direct;
    }

    // 直连域名列表判断
    if (directDomains.some((domain) => dnsDomainIs(host, domain))) {
        return direct;
    }

    for (let retry = 0; retry < MAX_RETRIES; retry++) {
        let selectedProxy = null;
        // 优先尝试 socks5 代理
        if (isProxyAvailable(socks5Proxy)) {
            selectedProxy = socks5Proxy;
        } else if (isProxyAvailable(httpProxy)) {
            selectedProxy = httpProxy;
        }

        if (selectedProxy) {
            // 确保TikTok使用代理
            if (shExpMatch(host, "*.tiktok.com")) {
                return url.startsWith("http:") || url.startsWith("https:")
                   ? selectedProxy
                    : direct;
            }

            // 行业规则判断
            const allDomainGroups = [
                socialMedia, devTools, finance, education, healthcare,
                entertainment, eCom, newsMedia, travel, gaming,
                automotive, aerospace, energy, retail, food,
                fashion, sports, home, edTech, logistics, adMarketing
            ];
            if (allDomainGroups.some((group) => matchIndustryDomain(host, group))) {
                return url.startsWith("http:") || url.startsWith("https:")
                   ? selectedProxy
                    : direct;
            }

            // 确保常见 App 域名使用代理
            const appDomains = [
                ".whatsapp.net", ".instagram.com", ".facebook.net", ".twitter.com", ".tiktok.com",
                ".snapchat.com", ".telegram.org", ".line.me", ".discord.com", ".viber.com"
            ];
            if (appDomains.some((domain) => shExpMatch(host, `*${domain}`))) {
                return url.startsWith("http:") || url.startsWith("https:")
                   ? selectedProxy
                    : direct;
            }

            return selectedProxy;
        } else {
            proxyFailureCount++;
            if (proxyFailureCount >= MAX_PROXY_FAILURES) {
                return direct;
            }
        }
    }

    // 所有重试都失败，直连
    return direct;
}

// 检查代理是否可用，使用ICMP检测逻辑
function isProxyAvailable(proxy) {
    if (proxyAvailabilityCache[proxy] === undefined) {
        proxyAvailabilityCache[proxy] = checkProxyWithICMP(proxy);
    }
    return proxyAvailabilityCache[proxy];
}

// 模拟ICMP检测代理可用性
function checkProxyWithICMP(proxy) {
    try {
        // 这里需要替换为实际的网络请求逻辑来检测代理可用性
        // 示例：尝试连接一个已知的公共网站
        // 可使用 XMLHttpRequest 或其他网络请求库
        return true;
    } catch (error) {
        return false;
    }
}
