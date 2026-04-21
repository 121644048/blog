let talkTimer = null;
const cacheKey = "liushenEchoCacheV2"
  , cacheTimeKey = "liushenEchoCacheTimeV2"
  , cacheDuration = 18e5;

// --- 保留原有数据处理逻辑，适配你的API数据结构 ---
function getEchoExtension(e) {
    return e?.extension && "object" == typeof e.extension ? e.extension : null
}
function getEchoExtensionType(e) {
    return getEchoExtension(e)?.type || ""
}
function getEchoImages(e) {
    return Array.isArray(e?.echo_files) ? e.echo_files.map((e => e?.file || e)).filter((e => {
        const t = String(e?.category || "").toLowerCase()
          , n = String(e?.content_type || "").toLowerCase();
        return "image" === t || n.startsWith("image/")
    }
    )).map((e => e?.url)).filter(Boolean) : []
}
function normalizeTalkItem(e) {
    return {
        content: e?.content || "",
        images: getEchoImages(e),
        extensionType: getEchoExtensionType(e)
    }
}
function getTalkIcons(e, t, n) {
    const a = [];
    return (e.images.length || t) && a.push("fa-solid fa-image"),
    "VIDEO" === e.extensionType && a.push("fa-solid fa-video"),
    "MUSIC" === e.extensionType && a.push("fa-solid fa-music"),
    ("WEBSITE" === e.extensionType || n) && a.push("fa-solid fa-link"),
    "GITHUBPROJ" === e.extensionType && a.push("fa-brands fa-github"),
    [...new Set(a)]
}
function toText(e) {
    return e.map((e => {
        const t = normalizeTalkItem(e);
        let n = t.content;
        const a = /\!\[.*?\]\(.*?\)/.test(n)
          , o = /\[.*?\]\(.*?\)/.test(n);
        n = n.replace(/#(.*?)\s/g, "").replace(/\{.*?\}/g, "").replace(/\!\[.*?\]\(.*?\)/g, "").replace(/\[.*?\]\(.*?\)/g, "$1").trim();
        const c = getTalkIcons(t, a, o).map((e => `<i class="${e}"></i>`)).join("");
        return c && (n = n ? `${n} <span class="talk-resource-icons">${c}</span>` : `<span class="talk-resource-icons">${c}</span>`),
        n || "..."
    }
    ))
}

// --- 参考你提供的逻辑，重写轮播核心函数 ---
function renderTalkTicker(e) {
    // 1. 获取DOM元素
    const talkListDom = document.querySelector("#bber-talk .talk-list");
    if (!talkListDom || e.length === 0) return;

    // 2. 初始化：只渲染第一条说说
    let currentIndex = 0;
    talkListDom.innerHTML = `<li class="item item-1">${e[currentIndex]}</li>`;

    // 3. 清除旧定时器
    if (talkTimer) clearInterval(talkTimer);

    // 4. 开启新定时器：每隔3秒切换到下一条
    talkTimer = setInterval(() => {
        // 计算下一条索引，取模实现循环
        currentIndex = (currentIndex + 1) % e.length;
        // 直接替换DOM内容为当前说说
        talkListDom.innerHTML = `<li class="item item-1">${e[currentIndex]}</li>`;
    }, 3000); // 3000是轮播间隔(毫秒)，可自行修改
}

function fetchTalkItems() {
    return fetch("https://echo.sunboy.ltd/api/echo/page", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            page: 1,
            pageSize: 30,
            search: ""
        })
    }).then((e => e.json())).then((e => 1 === e?.code && Array.isArray(e?.data?.items) ? e.data.items : (console.warn("Unexpected API response format:", e),
    [])))
}
function indexTalk() {
    if (talkTimer && (clearInterval(talkTimer),
    talkTimer = null),
    !document.getElementById("bber-talk"))
        return;
    const e = localStorage.getItem(cacheKey)
      , t = Number(localStorage.getItem(cacheTimeKey))
      , n = Date.now();
    e && t && n - t < 18e5 ? renderTalkTicker(toText(JSON.parse(e)).slice(0, 6)) : fetchTalkItems().then((e => {
        localStorage.setItem(cacheKey, JSON.stringify(e)),
        localStorage.setItem(cacheTimeKey, n.toString()),
        renderTalkTicker(toText(e).slice(0, 6))
    }
    )).catch((e => console.error("Error fetching data:", e)))
}
function whenDOMReady() {
    indexTalk()
}
whenDOMReady(),
document.addEventListener("pjax:complete", whenDOMReady);