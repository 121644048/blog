let talkTimer = null;
const cacheKey = "talksCache";
const cacheTimeKey = "talksCacheTime";
const cacheDuration = 18e5; // 缓存有效期：3分钟（180000毫秒）
let currentTalkIndex = 0; // 用于记录当前显示的说说索引

// 处理说说内容：仅保留纯文字，移除标签、图片、链接等
function processTalkContent(talkList) {
  return talkList.map(talk => {
    // 1. 移除 #标签 2. 移除 {xxx} 3. 移除图片标记 4. 移除链接标记 5. 移除视频内容 6. trim去空格
    return talk.content
      .replace(/#(.*?)\s/g, "") // 移除 #xxx 标签（含后续空格）
      .replace(/\{(.*?)\}/g, "") // 移除 {xxx} 格式内容
      .replace(/\!\[(.*?)\]\((.*?)\)/g, "") // 移除 ![描述](图片链接) 图片标记
      .replace(/\[(.*?)\]\((.*?)\)/g, "") // 移除 [文字](链接) 链接标记
      // 新添加：移除视频相关内容
      .replace(/<div\s+class="bilibili-video-container">[\s\S]*?<\/div>/g, "") // 移除B站视频容器
      .replace(/<iframe[^>]*>.*?<\/iframe>/g, "") // 移除iframe视频标签
      .trim(); // 去除前后空格，避免空内容
  }).filter(content => content); // 过滤空内容（防止无文字的说说）
}

// 单个说说显示与循环切换（一次只显示一条）
function renderAndLoopTalks(processedTalks) {
  const talkContainer = document.querySelector("#bber-talk .talk-list");
  if (!talkContainer || processedTalks.length === 0) return;

  // 清除旧定时器（避免重复）
  if (talkTimer) {
    clearInterval(talkTimer);
    talkTimer = null;
  }

  // 初始化显示第一条说说
  function updateTalkDisplay() {
    talkContainer.innerHTML = `<div class="current-talk">${processedTalks[currentTalkIndex]}</div>`;
    // 更新索引：到最后一条后重置为0（循环）
    currentTalkIndex = (currentTalkIndex + 1) % processedTalks.length;
  }
  updateTalkDisplay(); // 首次加载立即显示

  // 设置定时器：每3秒切换一条（可调整3e3为其他毫秒数）
  talkTimer = setInterval(updateTalkDisplay, 3e3);
}

// 获取指定API的说说数据
function fetchTalks() {
  // 目标API地址
  const targetApi = "https://bibiapi.sunboy.ltd/api/ispeak?author=68aa7f5488ac4d1fc3223aa5&page=1&pageSize=10";

  // 先检查缓存：有有效缓存则直接使用
  const cachedTalks = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);
  const currentTime = new Date().getTime();

  if (cachedTalks && cachedTime && currentTime - cachedTime < cacheDuration) {
    const processedTalks = processTalkContent(JSON.parse(cachedTalks));
    renderAndLoopTalks(processedTalks);
    return;
  }

  // 无缓存/缓存过期：请求新数据（GET方法）
  fetch(targetApi, {
    method: "GET",
  })
    .then(response => {
      if (!response.ok) throw new Error(`API请求失败：${response.status}`);
      return response.json();
    })
    .then(data => {
      // 根据新API返回结构调整
      if (data.code !== 0 || !data.data?.items || !Array.isArray(data.data.items)) {
        throw new Error("API返回数据格式错误，未找到有效说说列表");
      }

      // 缓存新数据到localStorage
      const talkList = data.data.items;
      localStorage.setItem(cacheKey, JSON.stringify(talkList));
      localStorage.setItem(cacheTimeKey, currentTime.toString());

      // 处理内容并开始循环显示
      const processedTalks = processTalkContent(talkList);
      renderAndLoopTalks(processedTalks);
    })
    .catch(error => {
      console.error("获取说说失败：", error);
    });
}

// 初始化：DOM就绪时加载，Pjax切换后重新加载
function whenDOMReady() {
  // 先检查容器是否存在（避免无效执行）
  if (!document.getElementById("bber-talk")) return;
  fetchTalks();
}

// 初始加载
whenDOMReady();
// Pjax页面切换后重新加载（适配部分博客框架）
document.addEventListener("pjax:complete", whenDOMReady);