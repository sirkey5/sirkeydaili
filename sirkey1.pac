/******************** 基础配置 ********************/
// 代理配置，代理失败自动直连
const proxy = "PROXY 192.168.1.55:10808; DIRECT";
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
    ".viber.com", ".skype.com", ".signal.org", ".zoom.us", ".slack.com", ".twitch.tv",
    ".tumblr.com", ".ok.ru", ".vk.com", ".momo.im"
];

// 开发者工具与云服务行业域名列表
const devTools = [
    ".github.com", ".gitlab.com", ".docker.com", ".npmjs.com", ".stackoverflow.com",
    ".jetbrains.com", ".postman.com", ".atlassian.com", ".jfrog.com", ".sonatype.com",
    ".kubernetes.io", ".terraform.io", ".vagrantup.com", ".ansible.com", ".puppet.com",
    ".chef.io", ".gradle.org", ".maven.org", ".nuget.org", ".pipelines.azure.com",
    ".heroku.com", ".aws.amazon.com", ".gcp.gvt2.com", ".digitalocean.com"
];

// 金融行业域名列表
const finance = [
    ".visa.com", ".mastercard.com", ".paypal.com", ".westernunion.com", ".bloomberg.com",
    ".reuters.com", ".nasdaq.com", ".nyse.com", ".londonstockexchange.com", ".xero.com",
    ".quickbooks.com", ".americanexpress.com", ".jpmorgan.com", ".citi.com", ".hsbc.com",
    ".charlesschwab.com", ".fidelity.com", ".vanguard.com", ".blackrock.com", ".creditease.cn",
    ".icbc.com.cn", ".bankofchina.com", ".cmbchina.com", ".bocom.com"
];

// 教育科研行业域名列表
const education = [
    ".coursera.org", ".edx.org", ".khanacademy.org", ".researchgate.net", ".ieee.org",
    ".springer.com", ".elsevier.com", ".acm.org", ".arxiv.org", ".jstor.org",
    ".mit.edu", ".harvard.edu", ".stanford.edu", ".cambridge.org", ".ox.ac.uk",
    ".nature.com", ".sciencemag.org", ".plos.org", ".wiley.com", ".sagepub.com",
    ".open.edu", ".tudelft.nl", ".ucl.ac.uk", ".ethz.ch"
];

// 医疗健康行业域名列表
const healthcare = [
    ".who.int", ".nih.gov", ".mayoclinic.org", ".webmd.com", ".medscape.com",
    ".clinicaltrials.gov", ".drugs.com", ".rxlist.com", ".healthline.com", ".patient.info",
    ".cdc.gov", ".fda.gov", ".ema.europa.eu", ".pfizer.com", ".moderna.com",
    ".astrazeneca.com", ".novartis.com", ".roche.com", ".merck.com", ".medtronic.com",
    ".bayer.com", ".sanofi.com", ".glaxosmithkline.com", ".johnsonandjohnson.com"
];

// 娱乐行业域名列表
const entertainment = [
    ".netflix.com", ".hulu.com", ".disneyplus.com", ".amazon.com/primevideo", ".apple.com/tv",
    ".spotify.com", ".deezer.com", ".tidal.com", ".bandcamp.com", ".itunes.apple.com",
    ".imdb.com", ".rottentomatoes.com", ".metacritic.com", ".gamespot.com", ".ign.com",
    ".steamcommunity.com", ".epicgames.com", ".ubisoft.com", ".sonyentertainmentnetwork.com", ".nintendo.com",
    ".hbo.com", ".paramountplus.com", ".crunchyroll.com", ".funimation.com"
];

// 电商行业域名列表
const eCom = [
    ".amazon.com", ".amazon.cn", ".amazon.in", ".ebay.com", ".aliexpress.com",
    ".taobao.com", ".tmall.com", ".jd.com", ".pinduoduo.com", ".walmart.com",
    ".costco.com", ".target.com", ".bestbuy.com", ".newegg.com", ".ikea.com",
    ".zara.com", ".hm.com", ".nike.com", ".adidas.com", ".macys.com",
    ".shein.com", ".etsy.com", ".shopify.com", ".overstock.com"
];

// 新闻媒体行业域名列表
const newsMedia = [
    ".cnn.com", ".bbc.com", ".foxnews.com", ".nytimes.com", ".washingtonpost.com",
    ".wsj.com", ".theguardian.com", ".abcnews.go.com", ".cnbc.com", ".reuters.com",
    ".apnews.com", ".msn.com", ".yandex.ru", ".sina.com.cn", ".sohu.com",
    ".ifeng.com", ".dw.com", ".france24.com", ".rt.com", ".aljazeera.com",
    ".chinadaily.com.cn", ".scmp.com", ".latimes.com", ".nbcnews.com"
];

// 旅游行业域名列表
const travel = [
    ".booking.com", ".agoda.com", ".expedia.com", ".tripadvisor.com", ".airbnb.com",
    ".kayak.com", ".skyscanner.net", ".travelocity.com", ".priceline.com", ".hotels.com",
    ".carnival.com", ".royalcaribbean.com", ".united.com", ".delta.com", ".americanairlines.com",
    ".vistara.com", ".emirates.com", ".qatarairways.com", ".singaporeair.com", ".lufthansa.com",
    ".airfrance.com", ".britishairways.com", ".easyjet.com", ".ryanair.com"
];

// 游戏行业域名列表
const gaming = [
    ".riotgames.com", ".blizzard.com", ".mojang.com", ".nintendo.co.jp", ".sony.com",
    ".xbox.com", ".ubisoft.com", ".ea.com", ".rockstargames.com", ".square-enix.com",
    ".ncsoft.com", ".nexon.com", ".netmarble.com", ".kakaogames.com", ".snk.com",
    ".sega.com", ".atlus.com", ".capcom.com", ".namco.com", ".tencentgames.com",
    ".playstation.com", ".nintendo.com", ".steamchina.com", ".garena.com"
];

// 汽车行业域名列表
const automotive = [
    ".toyota.com", ".honda.com", ".ford.com", ".gm.com", ".volkswagen.com",
    ".bmw.com", ".mercedes-benz.com", ".audi.com", ".tesla.com", ".nissan.com",
    ".hyundai.com", ".kia.com", ".mazda.com", ".subaru.com", ".mitsubishi-motors.com",
    ".fiat.com", ".chrysler.com", ".jeep.com", ".landrover.com", ".porsche.com",
    ".byd.com", ".geely.com", ".volvo.com", ".renault.com"
];

// 航空航天行业域名列表
const aerospace = [
    ".boeing.com", ".airbus.com", ".lockheedmartin.com", ".northropgrumman.com", ".raytheon.com",
    ".spacex.com", ".blueorigin.com", ".virgingalactic.com", ".esa.int", ".nasa.gov",
    ".jaxa.jp", ".cnsa.gov.cn", ".roscosmos.ru", ".airfrance.com", ".britishairways.com",
    ".lufthansa.com", ".singaporeair.com", ".qatarairways.com", ".emirates.com", ".delta.com",
    ".boeing.com.cn", ".airbus.com.cn", ".comac.cc", ".geaviation.com"
];

// 能源行业域名列表
const energy = [
    ".bp.com", ".shell.com", ".exxonmobil.com", ".chevron.com", ".totalenergies.com",
    ".eni.com", ".equinor.com", ".petrochina.com.cn", ".sinopec.com", ".cnooc.com.cn",
    ".gazprom.com", ".occidentalpetroleum.com", ".conocoPhillips.com", ".schlumberger.com",
    ".halliburton.com", ".bakerhughes.com", ".weatherford.com", ".solarcity.com", ".tesla.com/energy",
    ".cnpc.com.cn", ".bp.com.cn", ".shell.com.cn", ".exxonmobil.com.cn"
];

// 零售行业域名列表
const retail = [
    ".walmart.com", ".target.com", ".costco.com", ".samsclub.com", ".aldi.com",
    ".tesco.com", ".asda.com", ".carrefour.com", ".lidl.com", ".aldi.com",
    ".7-eleven.com", ".circlek.com", ".riteaid.com", ".walgreens.com", ".cvshealth.com",
    ".macys.com", ".nordstrom.com", ".bloomingdales.com", ".sears.com", ".jcpenney.com",
    ".aldi.us", ".lidl.us", ".dollarama.com", ".familydollar.com"
];

// 餐饮行业域名列表
const food = [
    ".mcdonalds.com", ".kfc.com", ".burgerking.com", ".starbucks.com", ".dominos.com",
    ".pizzahut.com", ".subway.com", ".wendys.com", ".tacobell.com", ".dunkindonuts.com",
    ".chipotle.com", ".pandaexpress.com", ".outbacksteakhouse.com", ".olivegarden.com", ".redlobster.com",
    ".mcdonalds.co.uk", ".kfc.co.uk", ".burgerking.co.uk", ".starbucks.co.uk", ".dominos.co.uk",
    ".dairyqueen.com", ".timhortons.com", ".popeyes.com", ".arbys.com"
];

// 时尚行业域名列表
const fashion = [
    ".gucci.com", ".prada.com", ".chanel.com", ".dior.com", ".louisvuitton.com",
    ".hermes.com", ".fendi.com", ".versace.com", ".armani.com", ".valentino.com",
    ".burberry.com", ".calvinklein.com", ".tommyhilfiger.com", ".ralphlauren.com", ".hugo.com",
    ".zara.com", ".hm.com", ".mango.com", ".uniqlo.com", ".gap.com",
    ".stella McCartney.com", ".coach.com", ".michaelkors.com", ".victoriassecret.com"
];

// 体育行业域名列表
const sports = [
    ".espn.com", ".foxsports.com", ".nba.com", ".nfl.com", ".mlb.com",
    ".nhl.com", ".fifa.com", ".uefa.com", ".olympic.org", ".tennis.com",
    ".golf.com", ".surfing.com", ".skiing.com", ".running.com", ".cycling.com",
    ".athletics.com", ".swimming.com", ".boxing.com", ".wwe.com", ".ufc.com",
    ".skysports.com", ".bbc.co.uk/sport", ".cbssports.com", ".nbcsports.com"
];

// 家居行业域名列表
const home = [
    ".ikea.com", ".wayfair.com", ".homedepot.com", ".lowes.com", ".bedbathandbeyond.com",
    ".potterybarn.com", ".westelm.com", ".crateandbarrel.com", ".anthropologie.com", ".cb2.com",
    ".restorationhardware.com", ".lululemon.com", ".nordstromrack.com", ".tjmaxx.com", ".marshalls.com",
    ".overstock.com", ".homedepot.ca", ".lowes.ca", ".wayfair.ca", ".ikea.ca",
    ".homedepot.co.uk", ".b&q.com", ".wickes.co.uk", ".screwfix.com"
];

// 教育科技行业域名列表
const edTech = [
    ".udemy.com", ".lynda.com", ".udacity.com", ".skillshare.com", ".teachable.com",
    ".classroom.google.com", ".canvas.instructure.com", ".moodle.org", ".blackboard.com", ".byjus.com",
    ".khanacademy.org", ".coursera.org", ".edx.org", ".pluralsight.com", ".datacamp.com",
    ".codecademy.com", ".treehouse.com", ".freecodecamp.org", ".w3schools.com", ".geeksforgeeks.org",
    ".skillsoft.com", ".edureka.co", ".udemybusiness.com", ".simplilearn.com"
];

// 物流行业域名列表
const logistics = [
    ".ups.com", ".fedex.com", ".dhl.com", ".tnt.com", ".aramex.com",
    ".postnl.nl", ".dpd.co.uk", ".royalmail.com", ".usps.com", ".canadapost.ca",
    ".singpost.com", ".china-post.com.cn", ".japanpost.jp", ".deutschepost.de", ".poste.it",
    ".correos.es", ".poste.fr", ".swisspost.ch", ".tnt.com", ".gls-group.eu",
    ".yanwen.com", ".shentong.com", ".yuantong.com", ".zhaijisong.com"
];

// 广告营销行业域名列表
const adMarketing = [
    ".google.com/ads", ".facebook.com/business", ".twitter.com/i/ads", ".linkedin.com/marketing-solutions",
    ".snapchat.com/business", ".tiktok.com/business", ".pinterest.com/business", ".youtube.com/ads",
    ".adobe.com/marketing-cloud", ".salesforce.com/products/marketing-cloud", ".hubspot.com",
    ".mailchimp.com", ".constantcontact.com", ".sendinblue.com", ".klaviyo.com",
    ".criteo.com", ".taboola.com", ".outbrain.com", ".appnexus.com", ".rubiconproject.com",
    ".adroll.com", ".marinsoftware.com", ".acquia.com", ".oracle.com/marketing-cloud"
];

// 直连域名列表，按分类注释
const directDomains = [ 
    // 政府机构
    "gov.cn",
    // 云存储
    "115.com", "123pan.com", "123957.com", "aliyundrive.com", "dropbox.com",
    // 搜索引擎
    "baidu.com", "baidupcs.com", "baidustatic.com", "bdimg.com", "bdstatic.com", "duckduckgo.com",
    // 其他国内常用服务
    "taobao.com", "tmall.com", "jd.com", "pinduoduo.com", "weibo.com", "weixin.qq.com"
];

// 缓存DNS解析结果，避免重复解析
const dnsCache = {};
function dnsResolveCached(host) {
    if (!dnsCache[host]) {
        dnsCache[host] = dnsResolve(host);
    }
    return dnsCache[host];
}

// 检查IP地址是否在指定的网络范围内
function isInPrivateNetwork(ip) {
    for (let i = 0; i < privateNetworks.length; i++) {
        const [network, mask] = privateNetworks[i].split('/');
        if (isInNet(ip, network, mask)) {
            return true;
        }
    }
    return false;
}

// 检查主机名是否匹配某个行业的域名列表
function matchIndustryDomain(host, domainGroup) {
    for (let i = 0; i < domainGroup.length; i++) {
        if (shExpMatch(host, "*" + domainGroup[i])) {
            return true;
        }
    }
    return false;
}

// 智能路由判断函数
function FindProxyForURL(url, host) {
    // 内网地址直连
    const ip = dnsResolveCached(host);
    if (isInPrivateNetwork(ip)) {
        return direct;
    }

    // 本地域名直连
    for (let i = 0; i < localTlds.length; i++) {
        if (host.endsWith(localTlds[i])) {
            return direct;
        }
    }

    // 行业规则判断
    const domainGroups = [
        socialMedia, devTools, finance, education, healthcare, 
        entertainment, eCom, newsMedia, travel, gaming, 
        automotive, aerospace, energy, retail, food, 
        fashion, sports, home, edTech, logistics, adMarketing
    ];
    for (let g = 0; g < domainGroups.length; g++) {
        if (matchIndustryDomain(host, domainGroups[g])) {
            return url.startsWith("http:") || url.startsWith("https:") ? proxy : direct;
        }
    }

    // 原有域名列表判断
    for (let i = 0; i < directDomains.length; i++) {
        if (dnsDomainIs(host, directDomains[i])) {
            return direct;
        }
    }

    // 最后尝试代理连接
    return proxy;
}

// 缓存上次代理检查时间
let lastCheck = 0;
// 检查代理是否可用，实际应包含ICMP检测逻辑
function isProxyAlive() {
    const now = Date.now();
    if (now - lastCheck > 300000) {
        lastCheck = now;
        // 这里需要实现实际的ICMP检测逻辑
        // 为了简化，暂时返回true
        return true; 
    }
    return true;
}
