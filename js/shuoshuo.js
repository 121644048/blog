!function() {
    const e = "liushenEchoCacheV2"
      , t = "liushenEchoCacheTimeV2"
      , n = window.__liushenShuoshuoState || (window.__liushenShuoshuoState = {
        resizeHandler: null,
        afterRenderTimer: null,
        listenersBound: !1
    });
    function a() {
        n.afterRenderTimer && (window.clearTimeout(n.afterRenderTimer),
        n.afterRenderTimer = null),
        n.resizeHandler && (window.removeEventListener("resize", n.resizeHandler),
        n.resizeHandler = null)
    }
    function r() {
        a();
        const r = document.querySelector("#talk");
        if (!r)
            return;
        r.innerHTML = "";
        const o = e => {
            function t(e, t) {
                const n = window.getComputedStyle(t);
                return parseFloat(n[`margin${e}`]) || 0
            }
            function r(e) {
                return `${e}px`
            }
            function i(e) {
                return parseFloat(e.style.left)
            }
            function l(e) {
                return e.clientWidth
            }
            function s(e) {
                return function(e) {
                    return parseFloat(e.style.top)
                }(e) + function(e) {
                    return e.clientHeight
                }(e) + t("Bottom", e)
            }
            function c(e) {
                return i(e) + l(e) + t("Right", e)
            }
            function d(e) {
                e.sort(( (e, t) => s(e) === s(t) ? i(t) - i(e) : s(t) - s(e)))
            }
            if ("string" == typeof e && (e = document.querySelector(e)),
            !e)
                return;
            const u = Array.from(e.children).map((e => (e.style.position = "absolute",
            e)));
            e.style.position = "relative";
            const p = [];
            u.length && (u[0].style.top = "0px",
            u[0].style.left = r(t("Left", u[0])),
            p.push(u[0]));
            let m = 1;
            for (; m < u.length; m += 1) {
                const n = u[m - 1]
                  , a = u[m];
                if (!(c(n) + l(a) <= l(e)))
                    break;
                a.style.top = n.style.top,
                a.style.left = r(c(n) + t("Left", a)),
                p.push(a)
            }
            for (; m < u.length; m += 1) {
                d(p);
                const e = u[m]
                  , n = p.pop();
                e.style.top = r(s(n) + t("Top", e)),
                e.style.left = r(i(n)),
                p.push(e)
            }
            d(p);
            const h = p[0];
            e.style.height = h ? r(s(h) + t("Bottom", h)) : "0px";
            const f = l(e);
            n.resizeHandler = () => {
                const e = document.querySelector("#talk");
                e && document.body.contains(e) ? l(e) !== f && o(e) : a()
            }
            ,
            window.addEventListener("resize", n.resizeHandler)
        }
          , i = e => {
            return t = e?.extension,
            t && "object" == typeof t ? t : null;
            var t
        }
          , l = e => Array.isArray(e?.tags) && e.tags.length ? e.tags.map((e => e?.name || e)).filter(Boolean) : ["无标签"]
          , s = e => {
            const t = new Date(e)
              , n = e => String(e).padStart(2, "0");
            return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`
        }
          , c = (e, t) => {
            if (!t)
                return "";
            let n = ""
              , a = ""
              , r = "https://image.sunboy.ltd/20251110232026415.avif";
            return "WEBSITE" === e && (n = t.site || t.url || "",
            a = t.title || n),
            "GITHUBPROJ" === e && (n = t.repoUrl || t.url || "",
            a = t.title || (e => {
                if (!e)
                    return "";
                const t = e.match(/^https?:\/\/github\.com\/[^/]+\/([^/?#]+)/i);
                if (t)
                    return t[1];
                try {
                    return new URL(e).pathname.split("/").filter(Boolean).pop() || e
                } catch (t) {
                    return e
                }
            }
            )(n),
            r = "https://image.sunboy.ltd/20251110232039013.avif"),
            n ? `\n            <div class="shuoshuo-external-link">\n                <a class="external-link" href="${n}" target="_blank" rel="nofollow noopener">\n                    <div class="external-link-left" style="background-image:url(${r})"></div>\n                    <div class="external-link-right">\n                        <div class="external-link-title">${a}</div>\n                        <div>点击跳转<i class="fa-solid fa-angle-right"></i></div>\n                    </div>\n                </a>\n            </div>\n        ` : ""
        }
          , d = e => {
            const t = e?.videoId || e?.url || "";
            if (!t)
                return "";
            let n = "";
            if (/^BV[0-9A-Za-z]+$/i.test(t))
                n = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${t}&as_wide=1&high_quality=1&danmaku=0`;
            else {
                const e = (e => {
                    if (!e)
                        return "";
                    if (/^[a-zA-Z0-9_-]{11}$/.test(e))
                        return e;
                    try {
                        const t = new URL(e);
                        if (t.hostname.includes("youtu.be"))
                            return t.pathname.replace("/", "");
                        if (t.hostname.includes("youtube.com"))
                            return t.searchParams.get("v") || t.pathname.split("/").filter(Boolean).pop() || ""
                    } catch (e) {
                        return ""
                    }
                    return ""
                }
                )(t);
                e && (n = `https://www.youtube.com/embed/${e}`)
            }
            return n ? `\n            <div style="position: relative; padding: 30% 45%; margin-top: 10px;">\n                <iframe\n                    style="position:absolute;width:100%;height:100%;left:0;top:0;border-radius:12px;"\n                    src="${n}"\n                    frameborder="0"\n                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"\n                    allowfullscreen\n                    loading="lazy">\n                </iframe>\n            </div>\n        ` : ""
        }
          , u = e => {
            const t = (e => i(e)?.type || "")(e)
              , n = (e => {
                const t = i(e);
                return t?.payload || null
            }
            )(e)
              , a = e?.content || ""
              , r = (e => Array.isArray(e?.echo_files) ? e.echo_files.map((e => e?.file || e)).filter((e => {
                const t = String(e?.category || "").toLowerCase()
                  , n = String(e?.content_type || "").toLowerCase();
                return "image" === t || n.startsWith("image/")
            }
            )).map((e => e?.url)).filter(Boolean) : [])(e);
            let o = `<div class="talk_content_text">${(e => (e || "").replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="nofollow noopener">@$1</a>').replace(/- \[ \]/g, "[]").replace(/- \[x\]/gi, "[x]").replace(/\n/g, "<br>"))(a)}</div>`;
            
            // ================== 关键修改开始 ==================
            return o += (e => e.length ? `<div class="zone_imgbox">${e.map((e => {
                // 1. 补全域名：如果是相对路径，加上 https://echo.sunboy.ltd
                // 2. 去掉 ?fmt=webp&q=75 参数
                const fullImageUrl = e.startsWith('http') ? e : `https://echo.sunboy.ltd${e}`;
                return `<a href="${fullImageUrl}" data-fancybox="gallery" class="fancybox"><img src="${fullImageUrl}" loading="lazy"></a>`
            })).join("")}</div>` : "")(r),
            // ================== 关键修改结束 ==================
            
            "WEBSITE" !== t && "GITHUBPROJ" !== t || (o += c(t, n)),
            "MUSIC" === t && (o += (e => {
                const t = (e => {
                    const t = e?.url;
                    if (!t)
                        return null;
                    let n = "";
                    t.includes("music.163.com") && (n = "netease"),
                    t.includes("y.qq.com") && (n = "tencent");
                    const a = t.match(/id=(\d+)/);
                    return n && a ? {
                        server: n,
                        id: a[1]
                    } : null
                }
                )(e);
                return t ? `<meting-js server="${t.server}" type="song" id="${t.id}" api="https://met.sunboy.ltd/api?server=:server&type=:type&id=:id&auth=:auth&r=:r"></meting-js>` : ""
            }
            )(n)),
            "VIDEO" === t && (o += d(n)),
            {
                content: o,
                user: "Sun Boy" || "匿名",
                avatar: "https://cfbed.sunboy.ltd/file/1757744380074_about.jpg",
                date: s(e?.created_at),
                tags: l(e),
                quoteText: a
            }
        }
          , p = e => {
            const t = document.querySelector(".el-textarea__inner");
            t && (t.value = `> ${e || ""}\n\n`,
            t.focus(),
            window.btf?.snackbarShow && btf.snackbarShow("已为您引用该说说，删除空格效果更佳"))
        }
          , m = () => {
            o("#talk"),
            window.btf?.loadLightbox && btf.loadLightbox(document.querySelectorAll("#talk img:not(.no-lightbox)")),
            window.lazyLoadInstance?.update && lazyLoadInstance.update()
        }
          , h = e => {
            e.map(u).forEach((e => r.appendChild((e => {
                const t = document.createElement("div");
                t.className = "talk_item";
                const n = document.createElement("div");
                n.className = "talk_meta";
                const a = document.createElement("img");
                a.className = "no-lightbox avatar",
                a.src = e.avatar;
                const r = document.createElement("div");
                r.className = "info";
                const o = document.createElement("span");
                o.className = "talk_nick",
                o.innerHTML = `${e.user}`;
                const i = document.createElement("span");
                i.className = "talk_date",
                i.textContent = e.date,
                r.appendChild(o),
                r.appendChild(i),
                n.appendChild(a),
                n.appendChild(r);
                const l = document.createElement("div");
                l.className = "talk_content",
                l.innerHTML = e.content;
                const s = document.createElement("div");
                s.className = "talk_bottom";
                const c = document.createElement("div")
                  , d = document.createElement("span");
                d.className = "talk_tag",
                d.textContent = `🏷️ ${e.tags.join(" / ")}`,
                c.appendChild(d);
                const u = document.createElement("a");
                u.href = "javascript:;",
                u.addEventListener("click", ( () => p(e.quoteText)));
                const m = document.createElement("span");
                return m.className = "icon",
                m.innerHTML = '<i class="fa-solid fa-message fa-fw"></i>',
                u.appendChild(m),
                s.appendChild(c),
                s.appendChild(u),
                t.appendChild(n),
                t.appendChild(l),
                t.appendChild(s),
                t
            }
            )(e)))),
            m();
            r.querySelectorAll("img, iframe, meting-js").forEach((e => {
                e.addEventListener("load", m, {
                    once: !0
                })
            }
            )),
            n.afterRenderTimer = window.setTimeout(m, 300)
        }
        ;
        ( () => {
            const n = localStorage.getItem(e)
              , a = Number(localStorage.getItem(t))
              , r = Date.now();
            n && a && r - a < 18e5 ? h(JSON.parse(n)) : fetch("https://echo.sunboy.ltd/api/echo/page", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    page: 1,
                    pageSize: 30,
                    search: ""
                })
            }).then((e => e.json())).then((n => {
                if (1 !== n?.code || !Array.isArray(n?.data?.items))
                    return console.warn("Unexpected API response format:", n),
                    void h([]);
                localStorage.setItem(e, JSON.stringify(n.data.items)),
                localStorage.setItem(t, r.toString()),
                h(n.data.items)
            }
            )).catch((e => console.error("Error fetching data:", e)))
        }
        )()
    }
    function o() {
        r()
    }
    window.initShuoshuoPage = o,
    n.listenersBound || (document.addEventListener("pjax:send", a),
    document.addEventListener("pjax:complete", o),
    n.listenersBound = !0),
    o()
}();