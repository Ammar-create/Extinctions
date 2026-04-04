(function () {

    // ─── Crypto Helpers ───────────────────────────────────────────────────────

    function md5(inputBytes) {
        // Pure-JS MD5 implementation
        function safeAdd(x, y) {
            const lsw = (x & 0xffff) + (y & 0xffff);
            const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }
        function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
        function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
        function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
        function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
        function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
        function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

        function bytesToWords(bytes) {
            const words = [];
            for (let i = 0; i < bytes.length; i++) {
                words[i >> 2] |= bytes[i] << ((i % 4) * 8);
            }
            return words;
        }

        const bytes = Array.from(inputBytes);
        const length8 = bytes.length;
        bytes.push(0x80);
        while (bytes.length % 64 !== 56) bytes.push(0);
        const lenBits = length8 * 8;
        bytes.push(lenBits & 0xff, (lenBits >> 8) & 0xff, (lenBits >> 16) & 0xff, (lenBits >> 24) & 0xff, 0, 0, 0, 0);

        const M = bytesToWords(bytes);
        let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

        for (let i = 0; i < M.length; i += 16) {
            const [aa, bb, cc, dd] = [a, b, c, d];
            a = md5ff(a,b,c,d,M[i+0],7,-680876936);  d = md5ff(d,a,b,c,M[i+1],12,-389564586);
            c = md5ff(c,d,a,b,M[i+2],17,606105819);  b = md5ff(b,c,d,a,M[i+3],22,-1044525330);
            a = md5ff(a,b,c,d,M[i+4],7,-176418897);  d = md5ff(d,a,b,c,M[i+5],12,1200080426);
            c = md5ff(c,d,a,b,M[i+6],17,-1473231341);b = md5ff(b,c,d,a,M[i+7],22,-45705983);
            a = md5ff(a,b,c,d,M[i+8],7,1770035416);  d = md5ff(d,a,b,c,M[i+9],12,-1958414417);
            c = md5ff(c,d,a,b,M[i+10],17,-42063);    b = md5ff(b,c,d,a,M[i+11],22,-1990404162);
            a = md5ff(a,b,c,d,M[i+12],7,1804603682); d = md5ff(d,a,b,c,M[i+13],12,-40341101);
            c = md5ff(c,d,a,b,M[i+14],17,-1502002290);b = md5ff(b,c,d,a,M[i+15],22,1236535329);
            a = md5gg(a,b,c,d,M[i+1],5,-165796510);  d = md5gg(d,a,b,c,M[i+6],9,-1069501632);
            c = md5gg(c,d,a,b,M[i+11],14,643717713); b = md5gg(b,c,d,a,M[i+0],20,-373897302);
            a = md5gg(a,b,c,d,M[i+5],5,-701558691);  d = md5gg(d,a,b,c,M[i+10],9,38016083);
            c = md5gg(c,d,a,b,M[i+15],14,-660478335);b = md5gg(b,c,d,a,M[i+4],20,-405537848);
            a = md5gg(a,b,c,d,M[i+9],5,568446438);   d = md5gg(d,a,b,c,M[i+14],9,-1019803690);
            c = md5gg(c,d,a,b,M[i+3],14,-187363961); b = md5gg(b,c,d,a,M[i+8],20,1163531501);
            a = md5gg(a,b,c,d,M[i+13],5,-1444681467);d = md5gg(d,a,b,c,M[i+2],9,-51403784);
            c = md5gg(c,d,a,b,M[i+7],14,1735328473); b = md5gg(b,c,d,a,M[i+12],20,-1926607734);
            a = md5hh(a,b,c,d,M[i+5],4,-378558);     d = md5hh(d,a,b,c,M[i+8],11,-2022574463);
            c = md5hh(c,d,a,b,M[i+11],16,1839030562);b = md5hh(b,c,d,a,M[i+14],23,-35309556);
            a = md5hh(a,b,c,d,M[i+1],4,-1530992060); d = md5hh(d,a,b,c,M[i+4],11,1272893353);
            c = md5hh(c,d,a,b,M[i+7],16,-155497632); b = md5hh(b,c,d,a,M[i+10],23,-1094730640);
            a = md5hh(a,b,c,d,M[i+13],4,681279174);  d = md5hh(d,a,b,c,M[i+0],11,-358537222);
            c = md5hh(c,d,a,b,M[i+3],16,-722521979); b = md5hh(b,c,d,a,M[i+6],23,76029189);
            a = md5hh(a,b,c,d,M[i+9],4,-640364487);  d = md5hh(d,a,b,c,M[i+12],11,-421815835);
            c = md5hh(c,d,a,b,M[i+15],16,530742520); b = md5hh(b,c,d,a,M[i+2],23,-995338651);
            a = md5ii(a,b,c,d,M[i+0],6,-198630844);  d = md5ii(d,a,b,c,M[i+7],10,1126891415);
            c = md5ii(c,d,a,b,M[i+14],15,-1416354905);b = md5ii(b,c,d,a,M[i+5],21,-57434055);
            a = md5ii(a,b,c,d,M[i+12],6,1700485571); d = md5ii(d,a,b,c,M[i+3],10,-1894986606);
            c = md5ii(c,d,a,b,M[i+10],15,-1051523);  b = md5ii(b,c,d,a,M[i+1],21,-2054922799);
            a = md5ii(a,b,c,d,M[i+8],6,1873313359);  d = md5ii(d,a,b,c,M[i+15],10,-30611744);
            c = md5ii(c,d,a,b,M[i+6],15,-1560198380);b = md5ii(b,c,d,a,M[i+13],21,1309151649);
            a = md5ii(a,b,c,d,M[i+4],6,-145523070);  d = md5ii(d,a,b,c,M[i+11],10,-1120210379);
            c = md5ii(c,d,a,b,M[i+2],15,718787259);  b = md5ii(b,c,d,a,M[i+9],21,-343485551);
            a = safeAdd(a, aa); b = safeAdd(b, bb); c = safeAdd(c, cc); d = safeAdd(d, dd);
        }

        const result = [a, b, c, d];
        let hex = '';
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < 4; j++) {
                hex += ('0' + ((result[i] >> (j * 8)) & 0xff).toString(16)).slice(-2);
            }
        }
        return hex;
    }

    function strToUtf8Bytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code < 0x80) bytes.push(code);
            else if (code < 0x800) { bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f)); }
            else { bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f)); }
        }
        return bytes;
    }

    function hmacMd5(keyBytes, messageBytes) {
        const blockSize = 64;
        let k = keyBytes.length > blockSize
            ? strToUtf8Bytes(md5(keyBytes)) // shouldn't happen here but safe
            : keyBytes.slice();
        while (k.length < blockSize) k.push(0);
        const ipad = k.map(b => b ^ 0x36);
        const opad = k.map(b => b ^ 0x5c);
        const innerHash = md5(new Uint8Array([...ipad, ...messageBytes]));
        const innerBytes = innerHash.match(/.{2}/g).map(h => parseInt(h, 16));
        return md5(new Uint8Array([...opad, ...innerBytes]));
    }

    function base64EncodeBytes(bytes) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '', i = 0;
        while (i < bytes.length) {
            const a = bytes[i++], b = bytes[i++], c = bytes[i++];
            result += chars[a >> 2];
            result += chars[((a & 3) << 4) | (b >> 4)];
            result += b !== undefined ? chars[((b & 15) << 2) | (c >> 6)] : '=';
            result += c !== undefined ? chars[c & 63] : '=';
        }
        return result;
    }

    function base64DecodeToBytes(str) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const bytes = [];
        str = str.replace(/=+$/, '');
        for (let i = 0; i < str.length; i += 4) {
            const [a, b, c, d] = [str[i], str[i+1], str[i+2], str[i+3]].map(ch => chars.indexOf(ch));
            bytes.push((a << 2) | (b >> 4));
            if (c !== -1) bytes.push(((b & 15) << 4) | (c >> 2));
            if (d !== -1) bytes.push(((c & 3) << 6) | d);
        }
        return bytes;
    }

    // ─── Keys (base64-decoded at init) ───────────────────────────────────────
    const SECRET_KEY_DEFAULT_B64 = "NzZpUmwwN3MweFNOOWpxbUVXQXQ3OUVCSlp1bElRSXNWNjRGWnIyTw==";
    const SECRET_KEY_ALT_B64     = "WHFuMm5uTzQxL0w5Mm8xaXVYaFNMSFRiWHZZNFo1Wlo2Mm04bVNMQQ==";
    const secretKeyDefault = atob(SECRET_KEY_DEFAULT_B64);
    const secretKeyAlt     = atob(SECRET_KEY_ALT_B64);

    // ─── Device Fingerprint ──────────────────────────────────────────────────
    function generateDeviceId() {
        return Array.from({ length: 16 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join('');
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
        const model = models[Math.floor(Math.random() * models.length)];
        return { brand, model };
    }

    // ─── Signature Generation ─────────────────────────────────────────────────
    function buildCanonicalString(method, accept, contentType, url, body, timestamp) {
        const parsed = new URL(url);
        const path = parsed.pathname;
        const params = [...parsed.searchParams.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => `${k}=${v}`)
            .join('&');
        const canonicalUrl = params ? `${path}?${params}` : path;

        let bodyHash = '';
        let bodyLength = '';
        if (body) {
            const bodyBytes = strToUtf8Bytes(body);
            const trimmed = bodyBytes.length > 102400 ? bodyBytes.slice(0, 102400) : bodyBytes;
            bodyHash = md5(new Uint8Array(trimmed));
            bodyLength = String(bodyBytes.length);
        }

        return [
            method.toUpperCase(),
            accept || '',
            contentType || '',
            bodyLength,
            String(timestamp),
            bodyHash,
            canonicalUrl
        ].join('\n');
    }

    function generateXClientToken(hardcodedTimestamp) {
        const timestamp = String(hardcodedTimestamp || Date.now());
        const reversed = timestamp.split('').reverse().join('');
        const hash = md5(new Uint8Array(strToUtf8Bytes(reversed)));
        return `${timestamp},${hash}`;
    }

    function generateXTrSignature(method, accept, contentType, url, body, useAltKey, hardcodedTimestamp) {
        const timestamp = hardcodedTimestamp || Date.now();
        const canonical = buildCanonicalString(method, accept, contentType, url, body, timestamp);
        const secretStr = useAltKey ? secretKeyAlt : secretKeyDefault;
        const secretBytes = strToUtf8Bytes(secretStr);
        const msgBytes = strToUtf8Bytes(canonical);
        const sigHex = hmacMd5(secretBytes, msgBytes);
        const sigBytes = sigHex.match(/.{2}/g).map(h => parseInt(h, 16));
        const sigB64 = base64EncodeBytes(sigBytes);
        return `${timestamp}|2|${sigB64}`;
    }

    function buildClientInfo(brand, model, pkg, ver, verCode, region, lang) {
        return JSON.stringify({
            package_name: pkg,
            version_name: ver,
            version_code: verCode,
            os: "android",
            os_version: "13",
            device_id: DEVICE_ID,
            install_store: "ps",
            gaid: "d7578036d13336cc",
            brand: brand,
            model: model,
            system_language: lang || "en",
            net: "NETWORK_WIFI",
            region: region || "IN",
            timezone: "Asia/Calcutta",
            sp_code: ""
        });
    }

    function buildHeaders(xClientToken, xTrSignature, opts = {}) {
        const { brand, model } = randomBrandModel();
        const pkg = opts.pkg || "com.community.mbox.in";
        const ver = opts.ver || "3.0.03.0529.03";
        const verCode = opts.verCode || 50020042;
        const region = opts.region || "IN";
        const ua = opts.ua || `${pkg}/${verCode} (Linux; U; Android 16; en_IN; sdk_gphone64_x86_64; Build/BP22.250325.006; Cronet/133.0.6876.3)`;
        return {
            "user-agent": ua,
            "accept": "application/json",
            "content-type": opts.contentType || "application/json",
            "connection": "keep-alive",
            "x-client-token": xClientToken,
            "x-tr-signature": xTrSignature,
            "x-client-info": buildClientInfo(brand, model, pkg, ver, verCode, region),
            "x-client-status": "0",
            ...(opts.authorization ? { "Authorization": opts.authorization } : {}),
            ...(opts.extra || {})
        };
    }

    // ─── Quality Helper ──────────────────────────────────────────────────────
    function getHighestQuality(resolutions) {
        if (!resolutions) return null;
        for (const [label, q] of [["2160","4K"],["1440","1440p"],["1080","1080p"],["720","720p"],["480","480p"],["360","360p"],["240","240p"]]) {
            if (resolutions.includes(label)) return q;
        }
        return null;
    }

    // ─── Title normalization (for TMDb matching) ─────────────────────────────
    function normalizeTitle(s) {
        return s
            .replace(/\[.*?]/g, ' ')
            .replace(/\(.*?\)/g, ' ')
            .replace(/\b(dub|dubbed|hd|4k|hindi|tamil|telugu|dual audio)\b/gi, ' ')
            .trim().toLowerCase()
            .replace(/:/g, ' ')
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    function cleanTitle(s) {
        return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function tokenEquals(a, b) {
        const sa = new Set(a.split(/\s+/).filter(Boolean));
        const sb = new Set(b.split(/\s+/).filter(Boolean));
        if (!sa.size || !sb.size) return false;
        const inter = [...sa].filter(x => sb.has(x)).length;
        return inter >= Math.max(1, Math.floor(Math.min(sa.size, sb.size) * 3 / 4));
    }

    // ─── TMDb / IMDB ID lookup ────────────────────────────────────────────────
    const TMDB_KEY = "1865f43a0549ca50d341dd9ab8b29f49";
    const TMDB_API = "https://api.themoviedb.org/3";

    async function tmdbSearch(endpoint, extraParams) {
        const url = `${TMDB_API}/${endpoint}?api_key=${TMDB_KEY}${extraParams}&include_adult=false&page=1`;
        try {
            const resp = await http_get(url, {});
            const json = JSON.parse(resp.body);
            return json.results || [];
        } catch (_) { return []; }
    }

    async function identifyIDs(title, year, imdbRatingValue) {
        const normTitle = normalizeTitle(title);
        const encTitle = encodeURIComponent(normTitle);
        const yearParam = year ? `&year=${year}` : '';
        const tvYearParam = year ? `&first_air_date_year=${year}` : '';

        const [multiRes, tvRes, movieRes] = await Promise.all([
            tmdbSearch("search/multi",  `&query=${encTitle}${yearParam}`),
            tmdbSearch("search/tv",     `&query=${encTitle}${tvYearParam}`),
            tmdbSearch("search/movie",  `&query=${encTitle}${yearParam}`),
        ]);

        const queues = [
            { type: "multi",  results: multiRes },
            { type: "tv",     results: tvRes    },
            { type: "movie",  results: movieRes },
        ];

        let bestId = null, bestScore = -1, bestIsTv = false;

        for (const { type: sourceType, results } of queues) {
            for (const o of results) {
                const mediaType = sourceType === "multi" ? (o.media_type || "") : sourceType;
                const candidateId = o.id;
                if (!candidateId) continue;

                const titles = [o.title, o.name, o.original_title, o.original_name].filter(Boolean);
                const candDate = mediaType === "tv" ? (o.first_air_date || "") : (o.release_date || "");
                const candYear = candDate ? parseInt(candDate.substring(0, 4)) : null;
                const candRating = o.vote_average;

                let score = 0;
                const normClean = cleanTitle(normTitle);
                let titleScore = 0;
                for (const t of titles) {
                    const candClean = cleanTitle(t);
                    if (tokenEquals(candClean, normClean)) { titleScore = 50; break; }
                    if (candClean.includes(normClean) || normClean.includes(candClean)) titleScore = Math.max(titleScore, 20);
                }
                score += titleScore;
                if (candYear && year && candYear === year) score += 35;
                if (imdbRatingValue != null && candRating != null) {
                    const diff = Math.abs(candRating - imdbRatingValue);
                    if (diff <= 0.5) score += 10; else if (diff <= 1.0) score += 5;
                }
                if (o.popularity) score += Math.min(o.popularity / 100, 5);

                if (score > bestScore) {
                    bestScore = score;
                    bestId = candidateId;
                    bestIsTv = (mediaType === "tv");
                }
            }
        }

        if (!bestId || bestScore < 40) return { tmdbId: null, imdbId: null, isTv: false };

        try {
            const kind = bestIsTv ? "tv" : "movie";
            const detailUrl = `${TMDB_API}/${kind}/${bestId}?api_key=${TMDB_KEY}&append_to_response=external_ids`;
            const resp = await http_get(detailUrl, {});
            const detail = JSON.parse(resp.body);
            const imdbId = detail.external_ids?.imdb_id || null;
            return { tmdbId: bestId, imdbId, isTv: bestIsTv };
        } catch (_) {
            return { tmdbId: bestId, imdbId: null, isTv: bestIsTv };
        }
    }

    // ─── TMDb Logo fetching ───────────────────────────────────────────────────
    async function fetchTmdbLogoUrl(isTv, tmdbId) {
        if (!tmdbId) return null;
        try {
            const kind = isTv ? "tv" : "movie";
            const url = `${TMDB_API}/${kind}/${tmdbId}/images?api_key=${TMDB_KEY}`;
            const resp = await http_get(url, {});
            const json = JSON.parse(resp.body);
            const logos = json.logos || [];
            if (!logos.length) return null;

            // Prefer English non-SVG
            for (const logo of logos) {
                if (!logo.file_path) continue;
                if (logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg')) {
                    return `https://image.tmdb.org/t/p/w500${logo.file_path}`;
                }
            }
            // Highest-voted fallback
            const voted = logos.filter(l => l.vote_average > 0 && !l.file_path.endsWith('.svg'));
            if (voted.length) {
                voted.sort((a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count);
                return `https://image.tmdb.org/t/p/w500${voted[0].file_path}`;
            }
            return null;
        } catch (_) { return null; }
    }

    // ─── Cinemeta metadata enrichment ────────────────────────────────────────
    async function fetchCinemeta(imdbId, isTv) {
        if (!imdbId) return null;
        try {
            const metaType = isTv ? "series" : "movie";
            const url = `https://v3-cinemeta.strem.io/meta/${metaType}/${imdbId}.json`;
            const resp = await http_get(url, {});
            const json = JSON.parse(resp.body);
            return json.meta || null;
        } catch (_) { return null; }
    }

    // ─── Categories / Home Page config ───────────────────────────────────────
    // Format: { id, name, isPost } 
    // isPost=true  → POST to subject-api/list
    // isPost=false → GET  to tab/ranking-list
    const CATEGORIES = [
        { id: "4516404531735022304", name: "Trending",             isPost: false },
        { id: "5692654647815587592", name: "Trending in Cinema",   isPost: false },
        { id: "414907768299210008",  name: "Bollywood",            isPost: false },
        { id: "3859721901924910512", name: "South Indian",         isPost: false },
        { id: "8019599703232971616", name: "Hollywood",            isPost: false },
        { id: "4741626294545400336", name: "Top Series This Week", isPost: false },
        { id: "8434602210994128512", name: "Anime",                isPost: false },
        { id: "1255898847918934600", name: "Reality TV",           isPost: false },
        { id: "4903182713986896328", name: "Indian Drama",         isPost: false },
        { id: "7878715743607948784", name: "Korean Drama",         isPost: false },
        { id: "8788126208987989488", name: "Chinese Drama",        isPost: false },
        { id: "3910636007619709856", name: "Western TV",           isPost: false },
        { id: "5177200225164885656", name: "Turkish Drama",        isPost: false },
        // POST-based categories (channel lists)
        { id: "1|1",                                          name: "Movies",                isPost: true },
        { id: "1|2",                                          name: "Series",                isPost: true },
        { id: "1|1006",                                       name: "Anime (All)",           isPost: true },
        { id: "1|1;country=India",                            name: "Indian (Movies)",       isPost: true },
        { id: "1|2;country=India",                            name: "Indian (Series)",       isPost: true },
        { id: "1|1;classify=Hindi dub;country=United States", name: "USA (Movies)",          isPost: true },
        { id: "1|2;classify=Hindi dub;country=United States", name: "USA (Series)",          isPost: true },
        { id: "1|1;country=Japan",                            name: "Japan (Movies)",        isPost: true },
        { id: "1|2;country=Japan",                            name: "Japan (Series)",        isPost: true },
        { id: "1|1;country=Korea",                            name: "South Korean (Movies)", isPost: true },
        { id: "1|2;country=Korea",                            name: "South Korean (Series)", isPost: true },
        { id: "1|1;country=Nigeria",                          name: "Nollywood (Movies)",    isPost: true },
        { id: "1|1;classify=Hindi dub;genre=Action",          name: "Action (Movies)",       isPost: true },
        { id: "1|1;classify=Hindi dub;genre=Crime",           name: "Crime (Movies)",        isPost: true },
        { id: "1|2;classify=Hindi dub;genre=Crime",           name: "Crime (Series)",        isPost: true },
    ];

    // ─── Request helper ──────────────────────────────────────────────────────
    async function apiGet(url) {
        const tok = generateXClientToken();
        const sig = generateXTrSignature("GET", "application/json", "application/json", url);
        const headers = buildHeaders(tok, sig);
        const resp = await http_get(url, headers);
        if (!resp.body) throw new Error('Empty response from: ' + url);
        return JSON.parse(resp.body);
    }

    async function apiPost(url, jsonBody) {
        const tok = generateXClientToken();
        const sig = generateXTrSignature("POST", "application/json", "application/json; charset=utf-8", url, jsonBody);
        const headers = buildHeaders(tok, sig, { contentType: "application/json" });
        const resp = await http_post(url, headers, jsonBody);
        if (!resp.body) throw new Error('Empty response from: ' + url);
        return JSON.parse(resp.body);
    }

    // ─── Parse item helper ────────────────────────────────────────────────────
    function parseItem(item) {
        const title = (item.title || '').split('[')[0].trim();
        const id = item.subjectId;
        if (!title || !id) return null;
        const posterUrl = item.cover?.url || null;
        const type = item.subjectType === 2 ? "series" : "movie";
        return new MultimediaItem({
            title,
            url: id,
            posterUrl,
            type,
            score: item.imdbRatingValue ? parseFloat(item.imdbRatingValue) : undefined,
        });
    }

    // ─── getHome ─────────────────────────────────────────────────────────────
    async function getHome(cb) {
        try {
            const perPage = 15;
            const homeData = {};

            // Load categories one by one — parallel causes timeouts on mobile
            for (const cat of CATEGORIES.slice(0, 8)) {
                try {
                    let items = [];
                    if (!cat.isPost) {
                        const url = `${manifest.baseUrl}/wefeed-mobile-bff/tab/ranking-list?tabId=0&categoryType=${cat.id}&page=1&perPage=${perPage}`;
                        const root = await apiGet(url);
                        const raw = root?.data?.items || root?.data?.subjects || [];
                        items = raw.map(parseItem).filter(Boolean);
                    } else {
                        const postUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/list`;
                        const mainParts = cat.id.split(';')[0].split('|');
                        const channelId = mainParts[1];
                        const optStr = cat.id.includes(';') ? cat.id.substring(cat.id.indexOf(';') + 1) : '';
                        const opts = {};
                        optStr.split(';').forEach(part => {
                            const [k, v] = part.split('=');
                            if (k && v) opts[k.trim()] = v.trim();
                        });
                        const body = JSON.stringify({
                            page: 1, perPage, channelId,
                            classify: opts.classify || "All",
                            country:  opts.country  || "All",
                            year:     opts.year     || "All",
                            genre:    opts.genre    || "All",
                            sort:     opts.sort     || "ForYou"
                        });
                        const root = await apiPost(postUrl, body);
                        const raw = root?.data?.items || root?.data?.subjects || [];
                        items = raw.map(parseItem).filter(Boolean);
                    }
                    if (items.length > 0) homeData[cat.name] = items;
                } catch (_) { /* skip failed category and continue */ }
            }

            cb({ success: true, data: homeData });
        } catch (e) {
            cb({ success: false, error: e.message });
        }
    }

    // ─── search ──────────────────────────────────────────────────────────────
    async function search(query, cb) {
        try {
            const url = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/search/v2`;
            const body = JSON.stringify({ page: 1, perPage: 20, keyword: query });
            const root = await apiPost(url, body);
            const results = root?.data?.results || [];
            const items = [];
            for (const result of results) {
                const subjects = result.subjects || [];
                for (const subject of subjects) {
                    const item = parseItem(subject);
                    if (item) items.push(item);
                }
            }
            cb({ success: true, data: items });
        } catch (e) {
            cb({ success: false, error: e.message });
        }
    }

    // ─── load ────────────────────────────────────────────────────────────────
    async function load(url, cb) {
        try {
            // url is the subjectId
            const id = url;
            const apiUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${id}`;
            const root = await apiGet(apiUrl);
            const data = root?.data;
            if (!data) throw new Error("No data");

            const title = (data.title || '').split('[')[0].trim();
            const description = data.description || '';
            const releaseDate = data.releaseDate || '';
            const year = releaseDate ? parseInt(releaseDate.substring(0, 4)) : undefined;
            const coverUrl = data.cover?.url;
            const subjectType = data.subjectType || 1;
            const type = (subjectType === 2 || subjectType === 7) ? "series" : "movie";
            const genreStr = data.genre || '';
            const imdbRating = data.imdbRatingValue ? parseFloat(data.imdbRatingValue) : undefined;

            // Duration: parse "2h 15m" or "135m"
            let duration;
            if (data.duration) {
                const hm = data.duration.match(/(\d+)h\s*(\d+)m/);
                if (hm) duration = parseInt(hm[1]) * 60 + parseInt(hm[2]);
                else duration = parseInt(data.duration) || undefined;
            }

            // Cast
            const cast = (data.staffList || [])
                .filter(s => s.staffType === 1)
                .map(s => new Actor({ name: s.name, role: s.character, image: s.avatarUrl }));

            // ── External ID lookup + enrichment (all parallel) ──────────────
            const { tmdbId, imdbId, isTv } = await identifyIDs(
                title.split('(')[0].split('[')[0].trim(),
                year,
                imdbRating
            );

            const [logoUrl, cinemeta] = await Promise.all([
                fetchTmdbLogoUrl(isTv, tmdbId),
                fetchCinemeta(imdbId, isTv),
            ]);

            const finalPoster      = cinemeta?.poster      || coverUrl;
            const finalBackground  = cinemeta?.background  || coverUrl;
            const finalDescription = cinemeta?.overview    || cinemeta?.description || description;
            const finalScore       = cinemeta?.imdbRating  ? parseFloat(cinemeta.imdbRating) : imdbRating;

            const syncData = {};
            if (tmdbId) syncData.tmdb = String(tmdbId);
            if (imdbId) syncData.imdb = imdbId;

            if (type === "series") {
                // Collect all subject IDs (original + dubs)
                const allIds = [id];
                (data.dubs || []).forEach(d => {
                    if (d.subjectId && !allIds.includes(d.subjectId)) allIds.push(d.subjectId);
                });

                // Fetch season info for each subjectId
                const episodeMap = {}; // season -> Set of episode numbers

                await Promise.all(allIds.map(async (sid) => {
                    try {
                        const seasonUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/season-info?subjectId=${sid}`;
                        const sRoot = await apiGet(seasonUrl);
                        const seasons = sRoot?.data?.seasons || [];
                        for (const season of seasons) {
                            const sn = season.se || 1;
                            const maxEp = season.maxEp || 1;
                            if (!episodeMap[sn]) episodeMap[sn] = new Set();
                            for (let ep = 1; ep <= maxEp; ep++) episodeMap[sn].add(ep);
                        }
                    } catch (_) {}
                }));

                const episodes = [];
                const sortedSeasons = Object.keys(episodeMap).map(Number).sort((a, b) => a - b);
                for (const sn of sortedSeasons) {
                    const epNums = [...episodeMap[sn]].sort((a, b) => a - b);
                    for (const ep of epNums) {
                        episodes.push(new Episode({
                            name: `S${sn}E${ep}`,
                            url: `${id}|${sn}|${ep}`,
                            season: sn,
                            episode: ep,
                        }));
                    }
                }

                if (episodes.length === 0) {
                    episodes.push(new Episode({ name: "Episode 1", url: `${id}|1|1`, season: 1, episode: 1 }));
                }

                cb({
                    success: true,
                    data: new MultimediaItem({
                        title,
                        url: id,
                        posterUrl: finalPoster,
                        bannerUrl: finalBackground,
                        logoUrl:   logoUrl || undefined,
                        type: "series",
                        year,
                        score: finalScore,
                        duration,
                        description: finalDescription,
                        cast,
                        episodes,
                        syncData: Object.keys(syncData).length ? syncData : undefined,
                    })
                });
            } else {
                cb({
                    success: true,
                    data: new MultimediaItem({
                        title,
                        url: id,
                        posterUrl: finalPoster,
                        bannerUrl: finalBackground,
                        logoUrl:   logoUrl || undefined,
                        type: "movie",
                        year,
                        score: finalScore,
                        duration,
                        description: finalDescription,
                        cast,
                        syncData: Object.keys(syncData).length ? syncData : undefined,
                    })
                });
            }
        } catch (e) {
            cb({ success: false, error: e.message });
        }
    }

    // ─── loadStreams ──────────────────────────────────────────────────────────
    async function loadStreams(url, cb) {
        try {
            const parts = url.split('|');
            const originalSubjectId = parts[0];
            const season  = parts[1] ? parseInt(parts[1]) : 0;
            const episode = parts[2] ? parseInt(parts[2]) : 0;

            // Step 1: Get subject info to find dubs + auth token
            const subjectUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${originalSubjectId}`;
            const tok1 = generateXClientToken();
            const sig1 = generateXTrSignature("GET", "application/json", "application/json", subjectUrl);
            const { brand, model } = randomBrandModel();
            const PKG_ONEROOM   = "com.community.oneroom";
            const VER_ONEROOM   = "3.0.13.0325.03";
            const VERC_ONEROOM  = 50020088;
            const UA_ONEROOM    = `${PKG_ONEROOM}/${VERC_ONEROOM} (Linux; U; Android 13; en_US; ${brand}; Build/TQ3A.230901.001; Cronet/145.0.7582.0)`;

            const subjectHeaders = {
                "user-agent": UA_ONEROOM,
                "accept": "application/json",
                "content-type": "application/json",
                "connection": "keep-alive",
                "x-client-token": tok1,
                "x-tr-signature": sig1,
                "x-client-info": JSON.stringify({
                    package_name: PKG_ONEROOM,
                    version_name: VER_ONEROOM,
                    version_code: VERC_ONEROOM,
                    os: "android", os_version: "13",
                    install_ch: "ps", device_id: DEVICE_ID,
                    install_store: "ps",
                    gaid: "1b2212c1-dadf-43c3-a0c8-bd6ce48ae22d",
                    brand: model, model: brand,
                    system_language: "en", net: "NETWORK_WIFI",
                    region: "US", timezone: "Asia/Calcutta", sp_code: "",
                    "X-Play-Mode": "1", "X-Idle-Data": "1",
                    "X-Family-Mode": "0", "X-Content-Mode": "0"
                }),
                "x-client-status": "0"
            };

            const subjectResp = await http_get(subjectUrl, subjectHeaders);
            const subjectData = JSON.parse(subjectResp.body || '{}');

            // Extract token from x-user response header (if available)
            let token = null;
            const xUser = subjectResp.headers && (subjectResp.headers['x-user'] || subjectResp.headers['X-User']);
            if (xUser) {
                try { token = JSON.parse(xUser)?.token || null; } catch (_) {}
            }

            // Collect subjectIds with language labels
            const subjectIds = [[originalSubjectId, "Original"]];
            const dubs = subjectData?.data?.dubs || [];
            for (const dub of dubs) {
                if (dub.subjectId && dub.subjectId !== originalSubjectId && dub.lanName) {
                    subjectIds.push([dub.subjectId, dub.lanName]);
                }
            }
            // Fix original language name
            const origDub = dubs.find(d => d.subjectId === originalSubjectId);
            if (origDub?.lanName) subjectIds[0][1] = origDub.lanName;

            // Step 2: Fetch play-info for each subjectId
            const streams = [];

            for (const [subjectId, language] of subjectIds) {
                try {
                    const playUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/play-info?subjectId=${subjectId}&se=${season}&ep=${episode}`;
                    const tok2 = generateXClientToken();
                    const sig2 = generateXTrSignature("GET", "application/json", "application/json", playUrl);
                    const langLabel = language.replace(/dub/gi, 'Audio');

                    const playHeaders = {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "user-agent": UA_ONEROOM,
                        "accept": "application/json",
                        "content-type": "application/json",
                        "connection": "keep-alive",
                        "x-client-token": tok2,
                        "x-tr-signature": sig2,
                        "x-client-info": JSON.stringify({
                            package_name: PKG_ONEROOM,
                            version_name: VER_ONEROOM,
                            version_code: VERC_ONEROOM,
                            os: "android", os_version: "13",
                            install_ch: "ps", device_id: DEVICE_ID,
                            install_store: "ps",
                            gaid: "1b2212c1-dadf-43c3-a0c8-bd6ce48ae22d",
                            brand: model, model: brand,
                            system_language: "en", net: "NETWORK_WIFI",
                            region: "US", timezone: "Asia/Calcutta", sp_code: "",
                            "X-Play-Mode": "1", "X-Idle-Data": "1",
                            "X-Family-Mode": "0", "X-Content-Mode": "0"
                        }),
                        "x-client-status": "0"
                    };

                    const playResp = await http_get(playUrl, playHeaders );
                    if (!playResp.body) continue;
                    const playRoot = JSON.parse(playResp.body);
                    const playStreams = playRoot?.data?.streams || [];

                    if (playStreams.length > 0) {
                        for (const stream of playStreams) {
                            const streamUrl = stream.url;
                            if (!streamUrl) continue;
                            const format = stream.format || '';
                            const resolutions = stream.resolutions || '';
                            const signCookie = stream.signCookie || null;
                            const quality = getHighestQuality(resolutions);

                            const headers = { "Referer": manifest.baseUrl };
                            if (signCookie) headers["Cookie"] = signCookie;

                            streams.push(new StreamResult({
                                url: streamUrl,
                                quality: quality || undefined,
                                headers,
                            }));

                            // ── Subtitles: stream-level captions ────────────
                            const streamId = stream.id || `${subjectId}|${season}|${episode}`;
                            const authHdr = token ? { "Authorization": `Bearer ${token}` } : {};
                            const baseSubHdr = {
                                ...authHdr,
                                "user-agent": UA_ONEROOM,
                                "Accept": "",
                                "Content-Type": "",
                                "X-Client-Status": "0",
                                "x-client-info": JSON.stringify({
                                    package_name: PKG_ONEROOM,
                                    version_name: VER_ONEROOM,
                                    version_code: VERC_ONEROOM,
                                    os: "android", os_version: "13",
                                    install_ch: "ps", device_id: DEVICE_ID,
                                    install_store: "ps",
                                    gaid: "1b2212c1-dadf-43c3-a0c8-bd6ce48ae22d",
                                    brand: model, model: brand,
                                    system_language: "en", net: "NETWORK_WIFI",
                                    region: "US", timezone: "Asia/Calcutta", sp_code: "",
                                    "X-Play-Mode": "1", "X-Idle-Data": "1",
                                    "X-Family-Mode": "0", "X-Content-Mode": "0"
                                }),
                            };

                            // Endpoint 1: get-stream-captions
                            try {
                                const subUrl1 = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get-stream-captions?subjectId=${subjectId}&streamId=${streamId}`;
                                const tok4 = generateXClientToken();
                                const sig4 = generateXTrSignature("GET", "", "", subUrl1);
                                const subHdr1 = { ...baseSubHdr, "X-Client-Token": tok4, "x-tr-signature": sig4 };
                                const subResp1 = await http_get(subUrl1, subHdr1);
                                if (subResp1.body) {
                                    const subRoot1 = JSON.parse(subResp1.body);
                                    for (const cap of (subRoot1?.data?.extCaptions || [])) {
                                        if (!cap.url) continue;
                                        const lang = cap.language || cap.lanName || cap.lan || "Unknown";
                                        if (!streams[streams.length - 1].subtitles) streams[streams.length - 1].subtitles = [];
                                        streams[streams.length - 1].subtitles.push({
                                            url: cap.url,
                                            label: `${lang} (${langLabel})`,
                                            lang: lang
                                        });
                                    }
                                }
                            } catch (_) {}

                            // Endpoint 2: get-ext-captions
                            try {
                                const subUrl2 = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get-ext-captions?subjectId=${subjectId}&resourceId=${streamId}&episode=0`;
                                const tok5 = generateXClientToken();
                                const sig5 = generateXTrSignature("GET", "", "", subUrl2);
                                const subHdr2 = { ...baseSubHdr, "X-Client-Token": tok5, "x-tr-signature": sig5 };
                                const subResp2 = await http_get(subUrl2, subHdr2);
                                if (subResp2.body) {
                                    const subRoot2 = JSON.parse(subResp2.body);
                                    for (const cap of (subRoot2?.data?.extCaptions || [])) {
                                        if (!cap.url) continue;
                                        const lang = cap.lan || cap.lanName || cap.language || "Unknown";
                                        if (!streams[streams.length - 1].subtitles) streams[streams.length - 1].subtitles = [];
                                        streams[streams.length - 1].subtitles.push({
                                            url: cap.url,
                                            label: `${lang} (${langLabel})`,
                                            lang: lang
                                        });
                                    }
                                }
                            } catch (_) {}
                        }
                    } else {
                        // Fallback: resourceDetectors
                        const fallbackUrl = `${manifest.baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${subjectId}`;
                        const tok3 = generateXClientToken();
                        const sig3 = generateXTrSignature("GET", "application/json", "application/json", fallbackUrl);
                        const fbHeaders = { ...playHeaders, "x-client-token": tok3, "x-tr-signature": sig3 };
                        delete fbHeaders["Authorization"];

                        const fbResp = await http_get(fallbackUrl, fbHeaders );
                        if (fbResp.body) {
                            const fbRoot = JSON.parse(fbResp.body);
                            const detectors = fbRoot?.data?.resourceDetectors || [];
                            for (const det of detectors) {
                                for (const video of (det.resolutionList || [])) {
                                    const link = video.resourceLink;
                                    if (!link) continue;
                                    streams.push(new StreamResult({
                                        url: link,
                                        quality: video.resolution ? `${video.resolution}p` : undefined,
                                        headers: { "Referer": manifest.baseUrl },
                                    }));
                                }
                            }
                        }
                    }
                } catch (_) { continue; }
            }

            cb({ success: true, data: streams });
        } catch (e) {
            cb({ success: false, error: e.message });
        }
    }

    // ─── Export ───────────────────────────────────────────────────────────────
    globalThis.getHome     = getHome;
    globalThis.search      = search;
    globalThis.load        = load;
    globalThis.loadStreams  = loadStreams;

})();
