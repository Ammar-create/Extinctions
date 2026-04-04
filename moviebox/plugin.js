(function () {
    // --- Configuration & Constants ---
    const baseUrl = (typeof manifest !== 'undefined' && manifest.baseUrl) ? manifest.baseUrl : "https://api3.aoneroom.com";
    const secretKeyDefault = "76iRl07s0xSN9jqmEWAt79EBJZulIQIsV64FZr2O"; 
    const secretKeyAlt = "Xqn2nnO41/L92o1iuXhSLHTbXvY4Z5ZZ62m8mSLA"; 
    const deviceId = "d7578036d13336cc1b2212c1dadf43c3"; // Fixed dummy device ID

    // --- Minified MD5 & HMAC Utils ---
    const md5={hashHex:function(s){return binl2hex(core_md5(str2binl(s),s.length*8))},hmacB64:function(k,d){var b=str2binl(k);if(b.length>16)b=core_md5(b,k.length*8);var i=Array(16),o=Array(16);for(var j=0;j<16;j++){i[j]=b[j]^0x36363636;o[j]=b[j]^0x5C5C5C5C}var h=core_md5(i.concat(str2binl(d)),512+d.length*8);return binl2b64(core_md5(o.concat(h),512+128))}};
    function safe_add(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF)}
    function bit_rol(n,c){return(n<<c)|(n>>>(32-c))}
    function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}
    function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t)}
    function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)}
    function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}
    function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t)}
    function core_md5(x,l){x[l>>5]|=0x80<<((l)%32);x[(((l+64)>>>9)<<4)+14]=l;var a=1732584193,b=-271733879,c=-1732584194,d=271733878;for(var i=0;i<x.length;i+=16){var oa=a,ob=b,oc=c,od=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,oa);b=safe_add(b,ob);c=safe_add(c,oc);d=safe_add(d,od)}return[a,b,c,d]}
    function str2binl(s){var b=[],m=(1<<8)-1;for(var i=0;i<s.length*8;i+=8)b[i>>5]|=(s.charCodeAt(i/8)&m)<<(i%32);return b}
    function binl2hex(a){var h="0123456789abcdef",s="";for(var i=0;i<a.length*4;i++){s+=h.charAt((a[i>>2]>>((i%4)*8+4))&0xF)+h.charAt((a[i>>2]>>((i%4)*8))&0xF)}return s}
    function binl2b64(a){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s="";for(var i=0;i<a.length*4;i+=3){var r=(((a[i>>2]>>8*(i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>a.length*32)s+="=";else s+=t.charAt((r>>6*(3-j))&0x3F)}}return s}

    function toBinaryString(str) { return unescape(encodeURIComponent(str)); }

    function buildCanonicalString(method, accept, contentType, urlStr, bodyStr, timestamp) {
        let path = "", queryParams =[];
        let pathQuery = urlStr.includes("://") ? "/" + urlStr.split("://")[1].split("/").slice(1).join("/") : urlStr;

        if (pathQuery.includes("?")) {
            const parts = pathQuery.split("?");
            path = parts[0];
            const qString = parts.slice(1).join("?");
            if (qString) {
                const pairs = qString.split("&");
                for (const pair of pairs) {
                    const kv = pair.split("=");
                    queryParams.push({ k: kv[0], v: kv.slice(1).join("=") });
                }
            }
        } else {
            path = pathQuery;
        }

        let query = "";
        if (queryParams.length > 0) {
            let grouped = {};
            for (const p of queryParams) {
                if (!grouped[p.k]) grouped[p.k] = [];
                grouped[p.k].push(p.v);
            }
            let sortedKeys = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
            let qParts =[];
            for (const k of sortedKeys) {
                for (const v of grouped[k]) qParts.push(`${k}=${v}`); 
            }
            query = qParts.join("&");
        }

        const canonicalUrl = query ? `${path}?${query}` : path;
        let bodyHash = "", bodyLength = "";

        if (bodyStr) {
            let binBody = toBinaryString(bodyStr);
            let trimmed = binBody.length > 102400 ? binBody.substring(0, 102400) : binBody;
            bodyHash = md5.hashHex(trimmed);
            bodyLength = binBody.length.toString();
        }

        return `${method.toUpperCase()}\n${accept || ""}\n${contentType || ""}\n${bodyLength}\n${timestamp}\n${bodyHash}\n${canonicalUrl}`;
    }

    function generateXClientToken(timestamp) {
        const tsStr = timestamp.toString();
        const reversed = tsStr.split("").reverse().join("");
        const hash = md5.hashHex(toBinaryString(reversed));
        return `${tsStr},${hash}`;
    }

    function generateXTrSignature(method, accept, contentType, urlStr, bodyStr, useAltKey, timestamp) {
        const canonical = buildCanonicalString(method, accept, contentType, urlStr, bodyStr, timestamp);
        const secret = useAltKey ? secretKeyAlt : secretKeyDefault;
        const signatureB64 = md5.hmacB64(secret, canonical);
        return `${timestamp}|2|${signatureB64}`;
    }

    function generateHeaders(method, url, jsonBody) {
        const timestamp = Date.now();
        return {
            "user-agent": "com.community.mbox.in/50020042 (Linux; U; Android 16; en_IN; Pixel 7; Build/BP22.250325.006; Cronet/133.0.6876.3)",
            "accept": "application/json",
            "content-type": "application/json",
            "connection": "keep-alive",
            "x-client-token": generateXClientToken(timestamp),
            "x-tr-signature": generateXTrSignature(method, "application/json", method === "POST" ? "application/json; charset=utf-8" : "application/json", url, jsonBody, false, timestamp),
            "x-client-info": JSON.stringify({
                "package_name": "com.community.mbox.in", "version_name": "3.0.03.0529.03", "version_code": 50020042, "os": "android", "os_version": "16",
                "device_id": deviceId, "install_store": "ps", "gaid": "d7578036d13336cc", "brand": "Google", "model": "Pixel 7",
                "system_language": "en", "net": "NETWORK_WIFI", "region": "IN", "timezone": "Asia/Calcutta", "sp_code": ""
            }),
            "x-client-status": "0",
            "x-play-mode": "2"
        };
    }

    // --- Main Core Functions ---

    async function fetchCategoryItems(dataId, page) {
        const perPage = 15;
        let url, jsonBody = null, method = "GET";

        if (dataId.includes("|")) {
            url = `${baseUrl}/wefeed-mobile-bff/subject-api/list`;
            method = "POST";
            const mainParts = dataId.split(";")[0].split("|");
            
            let options = {};
            if (dataId.includes(";")) {
                const opts = dataId.split(";").slice(1);
                for (const opt of opts) {
                    const[k, v] = opt.split("=");
                    if (k && v) options[k] = v;
                }
            }
            jsonBody = JSON.stringify({
                page: page || parseInt(mainParts[0]) || 1,
                perPage: perPage,
                channelId: mainParts[1] || "",
                classify: options["classify"] || "All",
                country: options["country"] || "All",
                year: options["year"] || "All",
                genre: options["genre"] || "All",
                sort: options["sort"] || "ForYou"
            });
        } else {
            url = `${baseUrl}/wefeed-mobile-bff/tab/ranking-list?tabId=0&categoryType=${dataId}&page=${page}&perPage=${perPage}`;
        }

        const res = await fetch(url, { method, headers: generateHeaders(method, url, jsonBody), body: jsonBody });
        const root = await res.json();
        const items = root?.data?.items || root?.data?.subjects ||[];

        return items.map(item => {
            return new MultimediaItem({
                title: (item.title || "").split("[")[0],
                url: item.subjectId,
                posterUrl: item.cover?.url,
                type: item.subjectType === 2 ? "series" : "movie",
                score: item.imdbRatingValue ? parseFloat(item.imdbRatingValue) : null
            });
        }).filter(i => i.title && i.url);
    }

    async function getHome(cb) {
        const categories =[
            { id: "4516404531735022304", name: "Trending" },
            { id: "414907768299210008", name: "Bollywood" },
            { id: "1|1", name: "Movies" },
            { id: "1|2", name: "Series" },
            { id: "8434602210994128512", name: "Anime" }
        ];

        try {
            let homeData =[];
            for (const cat of categories) {
                let items = await fetchCategoryItems(cat.id, 1);
                if (items && items.length > 0) {
                    homeData.push({ title: cat.name, items: items });
                }
            }
            cb({ success: true, data: homeData });
        } catch (e) {
            cb({ success: false, error: e.toString() });
        }
    }

    async function search(query, cb) {
        try {
            const url = `${baseUrl}/wefeed-mobile-bff/subject-api/search/v2`;
            const jsonBody = JSON.stringify({ page: 1, perPage: 20, keyword: query });

            const res = await fetch(url, { method: "POST", headers: generateHeaders("POST", url, jsonBody), body: jsonBody });
            const root = await res.json();
            const results = root?.data?.results ||[];
            let searchList =[];

            for (const result of results) {
                const subjects = result.subjects ||[];
                for (const subject of subjects) {
                    if (!subject.title || !subject.subjectId) continue;
                    searchList.push(new MultimediaItem({
                        title: subject.title,
                        url: subject.subjectId,
                        posterUrl: subject.cover?.url,
                        type: subject.subjectType === 2 ? "series" : "movie",
                        score: subject.imdbRatingValue ? parseFloat(subject.imdbRatingValue) : null
                    }));
                }
            }
            cb({ success: true, data: searchList });
        } catch (e) {
            cb({ success: false, error: e.toString() });
        }
    }

    async function load(url, cb) {
        try {
            let id = url;
            if (url.includes("subjectId=")) id = url.match(/subjectId=([^&]+)/)[1];
            else if (url.includes("/")) id = url.split('/').pop();

            const finalUrl = `${baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${id}`;
            const res = await fetch(finalUrl, { headers: generateHeaders("GET", finalUrl, null) });
            
            if (!res.ok) throw new Error("Failed to load data");
            const root = await res.json();
            const data = root.data;
            if (!data) throw new Error("No data");

            const title = (data.title || "").split("[")[0];
            let durationMinutes = parseInt((data.duration || "0").replace(/\D/g, "")) || 0;

            const coverUrl = data.cover?.url;
            const type = (data.subjectType === 2 || data.subjectType === 7) ? "series" : "movie";

            let episodes =[];
            if (type === "series") {
                const allSubjectIds = [id];
                if (data.dubs) {
                    for (const dub of data.dubs) {
                        if (dub.subjectId && !allSubjectIds.includes(dub.subjectId)) allSubjectIds.push(dub.subjectId);
                    }
                }

                let episodeMap = {};
                for (const subjectId of allSubjectIds) {
                    const seasonUrl = `${baseUrl}/wefeed-mobile-bff/subject-api/season-info?subjectId=${subjectId}`;
                    try {
                        const seasonRes = await fetch(seasonUrl, { headers: generateHeaders("GET", seasonUrl, null) });
                        if (!seasonRes.ok) continue;
                        const seasonData = await seasonRes.json();
                        const seasons = seasonData.data?.seasons ||[];

                        for (const season of seasons) {
                            const seasonNumber = season.se || 1;
                            const maxEp = season.maxEp || 1;
                            if (!episodeMap[seasonNumber]) episodeMap[seasonNumber] = new Set();
                            for (let ep = 1; ep <= maxEp; ep++) episodeMap[seasonNumber].add(ep);
                        }
                    } catch (e) {}
                }

                for (const seasonNumber of Object.keys(episodeMap).map(Number).sort((a, b) => a - b)) {
                    const epSet = Array.from(episodeMap[seasonNumber]).sort((a, b) => a - b);
                    for (const episodeNumber of epSet) {
                        episodes.push(new Episode({
                            name: `Season ${seasonNumber} Episode ${episodeNumber}`,
                            url: `${id}|${seasonNumber}|${episodeNumber}`, // Stream mapping signature
                            season: seasonNumber,
                            episode: episodeNumber,
                            posterUrl: coverUrl
                        }));
                    }
                }

                if (episodes.length === 0) {
                    episodes.push(new Episode({ name: "Episode 1", url: `${id}|1|1`, season: 1, episode: 1, posterUrl: coverUrl }));
                }
            }

            const mItem = new MultimediaItem({
                title: title,
                url: id,
                posterUrl: coverUrl,
                bannerUrl: coverUrl,
                type: type,
                year: data.releaseDate ? parseInt(data.releaseDate.substring(0, 4)) : null,
                score: data.imdbRatingValue ? parseFloat(data.imdbRatingValue) : null,
                duration: durationMinutes,
                description: data.description,
            });

            mItem.episodes = episodes;
            cb({ success: true, data: mItem });

        } catch (e) {
            cb({ success: false, error: e.toString() });
        }
    }

    async function loadStreams(url, cb) {
        try {
            const parts = url.split("|");
            let originalSubjectId = parts[0];
            if (originalSubjectId.includes("get?subjectId")) originalSubjectId = originalSubjectId.match(/subjectId=([^&]+)/)[1];
            else if (originalSubjectId.includes("/")) originalSubjectId = originalSubjectId.split('/').pop();

            const season = parts.length > 1 ? parseInt(parts[1]) : 0;
            const episode = parts.length > 2 ? parseInt(parts[2]) : 0;

            const subjectUrl = `${baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${originalSubjectId}`;
            const subjectRes = await fetch(subjectUrl, { headers: generateHeaders("GET", subjectUrl, null) });
            
            let token = null;
            const xUser = subjectRes.headers.get("x-user");
            if (xUser) { try { token = JSON.parse(xUser).token; } catch (e) {} }

            const subjectRoot = await subjectRes.json();
            let subjectIds =[];
            let originalLanguageName = "Original";

            if (subjectRoot.data?.dubs) {
                for (const dub of subjectRoot.data.dubs) {
                    if (dub.subjectId === originalSubjectId) {
                        originalLanguageName = dub.lanName || "Original";
                    } else if (dub.subjectId && dub.lanName) {
                        subjectIds.push({ id: dub.subjectId, lang: dub.lanName });
                    }
                }
            }
            subjectIds.unshift({ id: originalSubjectId, lang: originalLanguageName });

            let results =[];

            for (const subj of subjectIds) {
                try {
                    const playUrl = `${baseUrl}/wefeed-mobile-bff/subject-api/play-info?subjectId=${subj.id}&se=${season}&ep=${episode}`;
                    const pHeaders = generateHeaders("GET", playUrl, null);
                    if (token) pHeaders["Authorization"] = `Bearer ${token}`;

                    const playRes = await fetch(playUrl, { headers: pHeaders });
                    if (!playRes.ok) continue;
                    const playRoot = await playRes.json();
                    const streams = playRoot.data?.streams ||[];

                    for (const stream of streams) {
                        if (!stream.url) continue;

                        let qualMatch = stream.resolutions ? stream.resolutions.match(/(2160|1440|1080|720|480|360|240)/) : null;
                        const sr = new StreamResult({
                            url: stream.url,
                            quality: qualMatch ? `${qualMatch[0]}p (${subj.lang})` : subj.lang,
                            headers: { "Referer": baseUrl }
                        });
                        if (stream.signCookie) sr.headers["Cookie"] = stream.signCookie;
                        results.push(sr);
                    }

                    // Fallback for missing streams
                    if (streams.length === 0) {
                        const fallbackUrl = `${baseUrl}/wefeed-mobile-bff/subject-api/get?subjectId=${subj.id}`;
                        const fRes = await fetch(fallbackUrl, { headers: generateHeaders("GET", fallbackUrl, null) });
                        const fRoot = await fRes.json();
                        for (const det of (fRoot.data?.resourceDetectors ||[])) {
                            for (const video of (det.resolutionList ||[])) {
                                if (video.resourceLink) {
                                    results.push(new StreamResult({
                                        url: video.resourceLink,
                                        quality: video.resolution ? `${video.resolution}p (${subj.lang})` : subj.lang,
                                        headers: { "Referer": baseUrl }
                                    }));
                                }
                            }
                        }
                    }

                } catch (e) {
                    continue;
                }
            }
            
            cb({ success: true, data: results });
        } catch (e) {
            cb({ success: false, error: e.toString() });
        }
    }

    // --- IMPORTANT: Export to SkyStream Global Scope ---
    globalThis.getHome = getHome;
    globalThis.search = search;
    globalThis.load = load;
    globalThis.loadStreams = loadStreams;

})();