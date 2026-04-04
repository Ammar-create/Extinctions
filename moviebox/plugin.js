(function () {

    // ─── Crypto Helpers ───────────────────────────────────────────────────────

    function md5(inputBytes) {
        function safeAdd(x, y) { const lsw = (x & 0xffff) + (y & 0xffff); const msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xffff); }
        function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
        function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
        function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
        function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
        function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
        function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }
        function bytesToWords(bytes) { const words = []; for (let i = 0; i < bytes.length; i++) { words[i >> 2] |= bytes[i] << ((i % 4) * 8); } return words; }
        const bytes = Array.from(inputBytes); const length8 = bytes.length;
        bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
        const lenBits = length8 * 8;
        bytes.push(lenBits & 0xff, (lenBits >> 8) & 0xff, (lenBits >> 16) & 0xff, (lenBits >> 24) & 0xff, 0, 0, 0, 0);
        const M = bytesToWords(bytes); let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
        for (let i = 0; i < M.length; i += 16) {
            const [aa, bb, cc, dd] = [a, b, c, d];
            a=md5ff(a,b,c,d,M[i+0],7,-680876936);d=md5ff(d,a,b,c,M[i+1],12,-389564586);c=md5ff(c,d,a,b,M[i+2],17,606105819);b=md5ff(b,c,d,a,M[i+3],22,-1044525330);
            a=md5ff(a,b,c,d,M[i+4],7,-176418897);d=md5ff(d,a,b,c,M[i+5],12,1200080426);c=md5ff(c,d,a,b,M[i+6],17,-1473231341);b=md5ff(b,c,d,a,M[i+7],22,-45705983);
            a=md5ff(a,b,c,d,M[i+8],7,1770035416);d=md5ff(d,a,b,c,M[i+9],12,-1958414417);c=md5ff(c,d,a,b,M[i+10],17,-42063);b=md5ff(b,c,d,a,M[i+11],22,-1990404162);
            a=md5ff(a,b,c,d,M[i+12],7,1804603682);d=md5ff(d,a,b,c,M[i+13],12,-40341101);c=md5ff(c,d,a,b,M[i+14],17,-1502002290);b=md5ff(b,c,d,a,M[i+15],22,1236535329);
            a=md5gg(a,b,c,d,M[i+1],5,-165796510);d=md5gg(d,a,b,c,M[i+6],9,-1069501632);c=md5gg(c,d,a,b,M[i+11],14,643717713);b=md5gg(b,c,d,a,M[i+0],20,-373897302);
            a=md5gg(a,b,c,d,M[i+5],5,-701558691);d=md5gg(d,a,b,c,M[i+10],9,38016083);c=md5gg(c,d,a,b,M[i+15],14,-660478335);b=md5gg(b,c,d,a,M[i+4],20,-405537848);
            a=md5gg(a,b,c,d,M[i+9],5,568446438);d=md5gg(d,a,b,c,M[i+14],9,-1019803690);c=md5gg(c,d,a,b,M[i+3],14,-187363961);b=md5gg(b,c,d,a,M[i+8],20,1163531501);
            a=md5gg(a,b,c,d,M[i+13],5,-1444681467);d=md5gg(d,a,b,c,M[i+2],9,-51403784);c=md5gg(c,d,a,b,M[i+7],14,1735328473);b=md5gg(b,c,d,a,M[i+12],20,-1926607734);
            a=md5hh(a,b,c,d,M[i+5],4,-378558);d=md5hh(d,a,b,c,M[i+8],11,-2022574463);c=md5hh(c,d,a,b,M[i+11],16,1839030562);b=md5hh(b,c,d,a,M[i+14],23,-35309556);
            a=md5hh(a,b,c,d,M[i+1],4,-1530992060);d=md5hh(d,a,b,c,M[i+4],11,1272893353);c=md5hh(c,d,a,b,M[i+7],16,-155497632);b=md5hh(b,c,d,a,M[i+10],23,-1094730640);
            a=md5hh(a,b,c,d,M[i+13],4,681279174);d=md5hh(d,a,b,c,M[i+0],11,-358537222);c=md5hh(c,d,a,b,M[i+3],16,-722521979);b=md5hh(b,c,d,a,M[i+6],23,76029189);
            a=md5hh(a,b,c,d,M[i+9],4,-640364487);d=md5hh(d,a,b,c,M[i+12],11,-421815835);c=md5hh(c,d,a,b,M[i+15],16,530742520);b=md5hh(b,c,d,a,M[i+2],23,-995338651);
            a=md5ii(a,b,c,d,M[i+0],6,-198630844);d=md5ii(d,a,b,c,M[i+7],10,1126891415);c=md5ii(c,d,a,b,M[i+14],15,-1416354905);b=md5ii(b,c,d,a,M[i+5],21,-57434055);
            a=md5ii(a,b,c,d,M[i+12],6,1700485571);d=md5ii(d,a,b,c,M[i+3],10,-1894986606);c=md5ii(c,d,a,b,M[i+10],15,-1051523);b=md5ii(b,c,d,a,M[i+1],21,-2054922799);
            a=md5ii(a,b,c,d,M[i+8],6,1873313359);d=md5ii(d,a,b,c,M[i+15],10,-30611744);c=md5ii(c,d,a,b,M[i+6],15,-1560198380);b=md5ii(b,c,d,a,M[i+13],21,1309151649);
            a=md5ii(a,b,c,d,M[i+4],6,-145523070);d=md5ii(d,a,b,c,M[i+11],10,-1120210379);c=md5ii(c,d,a,b,M[i+2],15,718787259);b=md5ii(b,c,d,a,M[i+9],21,-343485551);
            a=safeAdd(a,aa);b=safeAdd(b,bb);c=safeAdd(c,cc);d=safeAdd(d,dd);
        }
        const result=[a,b,c,d]; let hex='';
        for(let i=0;i<result.length;i++) for(let j=0;j<4;j++) hex+=('0'+((result[i]>>(j*8))&0xff).toString(16)).slice(-2);
        return hex;
    }

    function strToUtf8Bytes(str) {
        const b = [];
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c < 0x80) b.push(c);
            else if (c < 0x800) { b.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); }
            else { b.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); }
        }
        return b;
    }

    function hmacMd5(keyBytes, messageBytes) {
        const bs = 64; let k = keyBytes.slice();
        while (k.length < bs) k.push(0);
        const ipad = k.map(b => b ^ 0x36), opad = k.map(b => b ^ 0x5c);
        const inner = md5(new Uint8Array([...ipad, ...messageBytes]));
        const ib = inner.match(/.{2}/g).map(h => parseInt(h, 16));
        return md5(new Uint8Array([...opad, ...ib]));
    }

    function base64EncodeBytes(bytes) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let r = '', i = 0;
        while (i < bytes.length) {
            const a = bytes[i++], b = bytes[i++], c = bytes[i++];
            r += chars[a >> 2];
            r += chars[((a & 3) << 4) | (b >> 4)];
            r += b !== undefined ? chars[((b & 15) << 2) | (c >> 6)] : '=';
            r += c !== undefined ? chars[c & 63] : '=';
        }
        return r;
    }

    // ─── Keys ─────────────────────────────────────────────────────────────────
    // Decoded from base64 at runtime (same values as original Kotlin)
    function b64decode(s) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const bytes = []; s = s.replace(/=+$/, '');
        for (let i = 0; i < s.length; i += 4) {
            const [a, b, c, d] = [s[i], s[i+1], s[i+2], s[i+3]].map(ch => chars.indexOf(ch));
            bytes.push((a << 2) | (b >> 4));
            if (c !== -1) bytes.push(((b & 15) << 4) | (c >> 2));
            if (d !== -1) bytes.push(((c & 3) << 6) | d);
        }
        return bytes;
    }

    const SECRET_DEFAULT_BYTES = b64decode("NzZpUmwwN3MweFNOOWpxbUVXQXQ3OUVCSlp1bElRSXNWNjRGWnIyTw==");
    const SECRET_ALT_BYTES     = b64decode("WHFuMm5uTzQxL0w5Mm8xaXVYaFNMSFRiWHZZNFo1Wlo2Mm04bVNMQQ==");

    // ─── Device / Brand ───────────────────────────────────────────────────────
    function generateDeviceId() {
        return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    }
    const DEVICE_ID = generateDeviceId();

    const BRAND_MODELS = {
        Samsung: ["SM-S918B", "SM-A528B", "SM-M336B"],
        Xiaomi:  ["2201117TI", "M2012K11AI", "Redmi Note 11"],
        OnePlus: ["LE2111", "CPH2449", "IN2023"],
        Google:  ["Pixel 6", "Pixel 7", "Pixel 8"],
        Realme:  ["RMX3085", "RMX3360", "RMX3551"]
    };
    function randomBrandModel() {
        const brands = Object.keys(BRAND_MODELS);
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const models = BRAND_MODELS[brand];
        return { brand, model: models[Math.floor(Math.random() * models.length)] };
    }

    // ─── Signature ────────────────────────────────────────────────────────────
    function buildCanonicalString(method, accept, contentType, url, body, timestamp) {
        const parsed = new URL(url);
        const path = parsed.pathname;
        const params = [...parsed.searchParams.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `${k}=${v}`).join('&');
        const canonicalUrl = params ? `${path}?${params}` : path;
        let bodyHash = '', bodyLength = '';
        if (body) {
            const bb = strToUtf8Bytes(body);
            const trimmed = bb.length > 102400 ? bb.slice(0, 102400) : bb;
            bodyHash = md5(new Uint8Array(trimmed));
            bodyLength = String(bb.length);
        }
        return [method.toUpperCase(), accept || '', contentType || '', bodyLength, String(timestamp), bodyHash, canonicalUrl].join('\n');
    }

    function generateXClientToken() {
        const ts = String(Date.now());
        const rev = ts.split('').reverse().join('');
        return `${ts},${md5(new Uint8Array(strToUtf8Bytes(rev)))}`;
    }

    function generateXTrSignature(method, accept, contentType, url, body, useAlt) {
        const timestamp = Date.now();
        const canonical = buildCanonicalString(method, accept, contentType, url, body, timestamp);
        const keyBytes = useAlt ? SECRET_ALT_BYTES : SECRET_DEFAULT_BYTES;
        const sigHex = hmacMd5(keyBytes, strToUtf8Bytes(canonical));
        const sigBytes = sigHex.match(/.{2}/g).map(h => parseInt(h, 16));
        return `${timestamp}|2|${base64EncodeBytes(sigBytes)}`;
    }

    // ─── Headers ──────────────────────────────────────────────────────────────
    function makeHeaders(method, url, body, useAlt) {
        const { brand, model } = randomBrandModel();
        const tok = generateXClientToken();
        const sig = generateXTrSignature(method, "application/json", body ? "application/json; charset=utf-8" : "application/json", url, body, useAlt);
        return {
            "user-agent": "com.community.mbox.in/50020042 (Linux; U; Android 16; en_IN; sdk_gphone64_x86_64; Build/BP22.250325.006; Cronet/133.0.6876.3)",
            "accept": "application/json",
            "content-type": body ? "application/json" : "application/json",
            "connection": "keep-alive",
            "x-client-token": tok,
            "x-tr-signature": sig,
            "x-client-info": JSON.stringify({
                package_name: "com.community.mbox.in",
                version_name: "3.0.03.0529.03",
                version_code: 50020042,
                os: "android", os_version: "16",
                device_id: DEVICE_ID, install_store: "ps",
                gaid: "d7578036d13336cc",
                brand, model,
                system_language: "en", net: "NETWORK_WIFI",
                region: "IN", timezone: "Asia/Calcutta", sp_code: ""
            }),
            "x-client-status": "0"
        };
    }

    function makeHeadersOneroom(method, url, body, token) {
        const { brand, model } = randomBrandModel();
        const tok = generateXClientToken();
        const sig = generateXTrSignature(method, "application/json", body ? "application/json; charset=utf-8" : "application/json", url, body);
        const h = {
            "user-agent": "com.community.oneroom/50020088 (Linux; U; Android 13; en_US; sdk_gphone64_x86_64; Build/TQ3A.230901.001; Cronet/145.0.7582.0)",
            "accept": "application/json",
            "content-type": "application/json",
            "connection": "keep-alive",
            "x-client-token": tok,
            "x-tr-signature": sig,
            "x-client-info": JSON.stringify({
                package_name: "com.community.oneroom",
                version_name: "3.0.13.0325.03",
                version_code: 50020088,
                os: "android", os_version: "13",
                install_ch: "ps", device_id: DEVICE_ID, install_store: "ps",
                gaid: "1b2212c1-dadf-43c3-a0c8-bd6ce48ae22d",
                brand, model,
                system_language: "en", net: "NETWORK_WIFI",
                region: "US", timezone: "Asia/Calcutta", sp_code: "",
                "X-Play-Mode": "1", "X-Idle-Data": "1",
                "X-Family-Mode": "0", "X-Content-Mode": "0"
            }),
            "x-client-status": "0"
        };
        if (token) h["Authorization"] = "Bearer " + token;
        return h;
    }

    // ─── HTTP helpers (using SkyStream native http_get / http_post) ───────────
    async function apiGet(url) {
        const headers = makeHeaders("GET", url, null);
        const resp = await http_get(url, headers);
        if (resp.status !== 200) throw new Error("HTTP " + resp.status);
        return JSON.parse(resp.body);
    }

    async function apiPost(url, jsonBody) {
        const headers = makeHeaders("POST", url, jsonBody);
        const resp = await http_post(url, headers, jsonBody);
        if (resp.status !== 200) throw new Error("HTTP " + resp.status);
        return JSON.parse(resp.body);
    }

    // ─── Parse item ───────────────────────────────────────────────────────────
    function parseItem(item) {
        const title = (item.title || '').split('[')[0].trim();
        const id = item.subjectId;
        if (!title || !id) return null;
        return new MultimediaItem({
            title,
            url: id,
            posterUrl: item.cover && item.cover.url ? item.cover.url : "",
            type: item.subjectType === 2 ? "series" : "movie",
            score: item.imdbRatingValue ? parseFloat(item.imdbRatingValue) : undefined
        });
    }

    // ─── Categories ───────────────────────────────────────────────────────────
    const CATEGORIES = [
        { id: "4516404531735022304", name: "Trending",             isPost: false },
        { id: "5692654647815587592", name: "Trending in Cinema",   isPost: false },
        { id: "414907768299210008",  name: "Bollywood",            isPost: false },
        { id: "3859721901924910512", name: "South Indian",         isPost: false },
        { id: "8019599703232971616", name: "Hollywood",            isPost: false },
        { id: "4741626294545400336", name: "Top Series This Week", isPost: false },
        { id: "8434602210994128512", name: "Anime",                isPost: false },
        { id: "7878715743607948784", name: "Korean Drama",         isPost: false },
        { id: "1|1",                 name: "Movies",               isPost: true  },
        { id: "1|2",                 name: "Series",               isPost: true  },
    ];

    // ─── getHome — GET only, no POST ────────────────────────────────────────
    async function getHome(cb) {
        try {
            const homeData = {};
            // Only GET-based ranking categories — no POST to avoid hangs
            const GET_CATS = [
                { id: "4516404531735022304", name: "Trending"             },
                { id: "5692654647815587592", name: "Trending in Cinema"   },
                { id: "414907768299210008",  name: "Bollywood"            },
                { id: "3859721901924910512", name: "South Indian"         },
                { id: "8019599703232971616", name: "Hollywood"            },
                { id: "4741626294545400336", name: "Top Series This Week" },
                { id: "8434602210994128512", name: "Anime"                },
                { id: "7878715743607948784", name: "Korean Drama"         },
            ];
            for (const cat of GET_CATS) {
                try {
                    const url = manifest.baseUrl + "/wefeed-mobile-bff/tab/ranking-list?tabId=0&categoryType=" + cat.id + "&page=1&perPage=15";
                    const root = await apiGet(url);
                    const raw = (root.data && (root.data.items || root.data.subjects)) || [];
                    const items = raw.map(parseItem).filter(Boolean);
                    if (items.length > 0) homeData[cat.name] = items;
                } catch (_) {}
            }
            cb({ success: true, data: homeData });
        } catch (e) {
            cb({ success: false, errorCode: "HOME_ERROR", message: e.message });
        }
    }

    // ─── search — GET based ──────────────────────────────────────────────────
    async function search(query, cb) {
        try {
            const url = manifest.baseUrl + "/wefeed-mobile-bff/subject-api/search?keyword=" + encodeURIComponent(query) + "&page=1&perPage=20";
            const root = await apiGet(url);
            const results = (root.data && root.data.results) || [];
            const items = [];
            for (const result of results) {
                for (const subject of (result.subjects || [])) {
                    const item = parseItem(subject);
                    if (item) items.push(item);
                }
            }
            // fallback: direct items array
            if (items.length === 0) {
                const direct = (root.data && root.data.items) || [];
                for (const subject of direct) {
                    const item = parseItem(subject);
                    if (item) items.push(item);
                }
            }
            cb({ success: true, data: items });
        } catch (e) {
            cb({ success: false, errorCode: "SEARCH_ERROR", message: e.message });
        }
    }

    // ─── load ─────────────────────────────────────────────────────────────────
    async function load(url, cb) {
        try {
            const id = url;
            const apiUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${id}`;
            const root = await apiGet(apiUrl);
            const data = root.data;
            if (!data) throw new Error("No data");

            const title = (data.title || '').split('[')[0].trim();
            const description = data.description || '';
            const releaseDate = data.releaseDate || '';
            const year = releaseDate ? parseInt(releaseDate.substring(0, 4)) : undefined;
            const coverUrl = data.cover && data.cover.url ? data.cover.url : "";
            const subjectType = data.subjectType || 1;
            const type = (subjectType === 2 || subjectType === 7) ? "series" : "movie";
            const imdbRating = data.imdbRatingValue ? parseFloat(data.imdbRatingValue) : undefined;

            let duration;
            if (data.duration) {
                const hm = data.duration.match(/(\d+)h\s*(\d+)m/);
                if (hm) duration = parseInt(hm[1]) * 60 + parseInt(hm[2]);
                else duration = parseInt(data.duration) || undefined;
            }

            const cast = (data.staffList || [])
                .filter(s => s.staffType === 1)
                .map(s => new Actor({ name: s.name, role: s.character, image: s.avatarUrl }));

            if (type === "series") {
                const allIds = [id];
                (data.dubs || []).forEach(d => { if (d.subjectId && allIds.indexOf(d.subjectId) === -1) allIds.push(d.subjectId); });

                const episodeMap = {};
                for (const sid of allIds) {
                    try {
                        const seasonUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/season-info?subjectId=${sid}`;
                        const sRoot = await apiGet(seasonUrl);
                        const seasons = (sRoot.data && sRoot.data.seasons) || [];
                        for (const season of seasons) {
                            const sn = season.se || 1;
                            const maxEp = season.maxEp || 1;
                            if (!episodeMap[sn]) episodeMap[sn] = [];
                            for (let ep = 1; ep <= maxEp; ep++) {
                                if (episodeMap[sn].indexOf(ep) === -1) episodeMap[sn].push(ep);
                            }
                        }
                    } catch (_) {}
                }

                const episodes = [];
                const sortedSeasons = Object.keys(episodeMap).map(Number).sort((a, b) => a - b);
                for (const sn of sortedSeasons) {
                    for (const ep of episodeMap[sn].sort((a, b) => a - b)) {
                        episodes.push(new Episode({
                            name: "S" + sn + "E" + ep,
                            url: id + "|" + sn + "|" + ep,
                            season: sn,
                            episode: ep,
                            posterUrl: coverUrl
                        }));
                    }
                }
                if (episodes.length === 0) {
                    episodes.push(new Episode({ name: "Episode 1", url: id + "|1|1", season: 1, episode: 1, posterUrl: coverUrl }));
                }

                cb({ success: true, data: new MultimediaItem({
                    title, url: id, posterUrl: coverUrl, bannerUrl: coverUrl,
                    type: "series", year, score: imdbRating, duration,
                    description, cast, episodes
                })});
            } else {
                cb({ success: true, data: new MultimediaItem({
                    title, url: id, posterUrl: coverUrl, bannerUrl: coverUrl,
                    type: "movie", year, score: imdbRating, duration,
                    description, cast
                })});
            }
        } catch (e) {
            cb({ success: false, errorCode: "LOAD_ERROR", message: e.message });
        }
    }

    // ─── loadStreams ──────────────────────────────────────────────────────────
    async function loadStreams(url, cb) {
        try {
            const parts = url.split('|');
            const originalSubjectId = parts[0];
            const season  = parts[1] ? parseInt(parts[1]) : 0;
            const episode = parts[2] ? parseInt(parts[2]) : 0;

            // Step 1: get subject info + auth token
            const subjectUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${originalSubjectId}`;
            const subjectHeaders = makeHeadersOneroom("GET", subjectUrl, null);
            const subjectResp = await http_get(subjectUrl, subjectHeaders);

            let token = null;
            const xUser = subjectResp.headers && (subjectResp.headers['x-user'] || subjectResp.headers['X-User']);
            if (xUser) { try { token = JSON.parse(xUser).token || null; } catch (_) {} }

            const subjectData = subjectResp.status === 200 ? JSON.parse(subjectResp.body) : {};
            const dubs = (subjectData.data && subjectData.data.dubs) || [];

            const subjectIds = [[originalSubjectId, "Original"]];
            for (const dub of dubs) {
                if (dub.subjectId && dub.subjectId !== originalSubjectId && dub.lanName) {
                    subjectIds.push([dub.subjectId, dub.lanName]);
                }
            }
            const origDub = dubs.find(d => d.subjectId === originalSubjectId);
            if (origDub && origDub.lanName) subjectIds[0][1] = origDub.lanName;

            const streams = [];

            // Step 2: play-info per dub
            for (const entry of subjectIds) {
                const subjectId = entry[0];
                const language = entry[1];
                const langLabel = language.replace(/dub/gi, 'Audio');
                try {
                    const playUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/play-info?subjectId=${subjectId}&se=${season}&ep=${episode}`;
                    const playHeaders = makeHeadersOneroom("GET", playUrl, null, token);
                    const playResp = await http_get(playUrl, playHeaders);
                    if (playResp.status !== 200) continue;

                    const playRoot = JSON.parse(playResp.body);
                    const playStreams = (playRoot.data && playRoot.data.streams) || [];

                    if (playStreams.length > 0) {
                        for (const stream of playStreams) {
                            if (!stream.url) continue;
                            const headers = { "Referer": manifest.baseUrl };
                            if (stream.signCookie) headers["Cookie"] = stream.signCookie;
                            const quality = getHighestQuality(stream.resolutions || '');
                            streams.push(new StreamResult({
                                url: stream.url,
                                source: "MovieBox (" + langLabel + ")",
                                quality: quality || undefined,
                                headers
                            }));

                            // Subtitles
                            const streamId = stream.id || (subjectId + "|" + season + "|" + episode);
                            try {
                                const subUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get-stream-captions?subjectId=${subjectId}&streamId=${streamId}`;
                                const subHeaders = makeHeadersOneroom("GET", subUrl, null, token);
                                const subResp = await http_get(subUrl, subHeaders);
                                if (subResp.status === 200) {
                                    const subRoot = JSON.parse(subResp.body);
                                    for (const cap of ((subRoot.data && subRoot.data.extCaptions) || [])) {
                                        if (!cap.url) continue;
                                        const lang = cap.language || cap.lanName || cap.lan || "Unknown";
                                        if (!streams[streams.length - 1].subtitles) streams[streams.length - 1].subtitles = [];
                                        streams[streams.length - 1].subtitles.push({ url: cap.url, label: lang + " (" + langLabel + ")", lang });
                                    }
                                }
                            } catch (_) {}
                        }
                    } else {
                        // Fallback: resourceDetectors
                        const fbUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${subjectId}`;
                        const fbHeaders = makeHeadersOneroom("GET", fbUrl, null);
                        const fbResp = await http_get(fbUrl, fbHeaders);
                        if (fbResp.status === 200) {
                            const fbRoot = JSON.parse(fbResp.body);
                            for (const det of ((fbRoot.data && fbRoot.data.resourceDetectors) || [])) {
                                for (const video of (det.resolutionList || [])) {
                                    if (!video.resourceLink) continue;
                                    streams.push(new StreamResult({
                                        url: video.resourceLink,
                                        source: "MovieBox (" + langLabel + ")",
                                        quality: video.resolution ? video.resolution + "p" : undefined,
                                        headers: { "Referer": manifest.baseUrl }
                                    }));
                                }
                            }
                        }
                    }
                } catch (_) { continue; }
            }

            cb({ success: true, data: streams });
        } catch (e) {
            cb({ success: false, errorCode: "STREAM_ERROR", message: e.message });
        }
    }

    // ─── Quality helper ───────────────────────────────────────────────────────
    function getHighestQuality(resolutions) {
        for (const label of ["2160", "1440", "1080", "720", "480", "360", "240"]) {
            if (resolutions.includes(label)) return label + "p";
        }
        return null;
    }

    // ─── Export ───────────────────────────────────────────────────────────────
    globalThis.getHome    = getHome;
    globalThis.search     = search;
    globalThis.load       = load;
    globalThis.loadStreams = loadStreams;

})();
