(function() {
    /**
     * @type {import('@skystream/sdk').Manifest}
     */
    // manifest is injected at runtime

    const DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0";
    const DEFAULT_POSTER = "https://thumbs.dreamstime.com/b/cinema-poster-design-template-popcorn-box-disposable-cup-beverages-straw-film-strip-clapper-board-ticket-detailed-44098150.jpg";
    const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
    const TMDB_API_KEY = "1865f43a0549ca50d341dd9ab8b29f49";

    const SEARCH_FORM_DEFAULTS = {
        z: "Mwxxa3Vnaw",
        x: "b3716e05ff"
    };

    const commonHeaders = {
        "User-Agent": DEFAULT_UA,
        "Accept": "*/*",
        "Referer": manifest.baseUrl
    };

    function safeParse(data, fallback) {
        if (!data) return fallback === undefined ? null : fallback;
        if (typeof data === "object") return data;
        try {
            return JSON.parse(data);
        } catch (_) {
            return fallback === undefined ? null : fallback;
        }
    }

    function absUrl(url) {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (url.startsWith("//")) return "https:" + url;
        if (url.startsWith("/")) return manifest.baseUrl.replace(/\/$/, "") + url;
        return manifest.baseUrl.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
    }

    function text(el) {
        return el?.textContent?.trim() || "";
    }

    function parseYearFromTitle(title) {
        const match = /\((\d{4})\)\s*$/.exec(title || "");
        return match ? parseInt(match[1], 10) : undefined;
    }

    function normalizeTitle(rawTitle) {
        if (!rawTitle) return "Untitled";
        return rawTitle.replace(/\s*\(\d{4}\)\s*$/, "").trim();
    }

    function qualityFromLabel(label) {
        const t = (label || "").toLowerCase();
        if (t.includes("2160") || t.includes("4k")) return "2160p";
        if (t.includes("1080")) return "1080p";
        if (t.includes("720")) return "720p";
        if (t.includes("480")) return "480p";
        if (t.includes("360")) return "360p";
        if (t.includes("hd")) return "720p";
        if (t.includes("sd")) return "480p";
        return "Auto";
    }

    function dedupeByUrl(items) {
        const seen = new Set();
        return items.filter(item => {
            if (!item?.url || seen.has(item.url)) return false;
            seen.add(item.url);
            return true;
        });
    }

    function parseSetCookieHeader(headerValue) {
        const output = {};
        const raw = Array.isArray(headerValue) ? headerValue.join(",") : (headerValue || "");
        raw.split(/,(?=\s*[^;,=\s]+=)/).forEach(part => {
            const match = /^\s*([^=;\s]+)=([^;]*)/.exec(part);
            if (match) output[match[1]] = match[2];
        });
        return output;
    }

    function extract3chkPair(html) {
        const match = /_3chk\(\s*'([^']+)'\s*,\s*'([^']+)'/.exec(html || "");
        return match ? { key: match[1], value: match[2] } : null;
    }

    function buildCookieHeader(aGooz, pair) {
        const parts = [];
        if (aGooz) parts.push(`aGooz=${aGooz}`);
        if (pair?.key && pair?.value) parts.push(`${pair.key}=${pair.value}`);
        return parts.join("; ");
    }

    async function fetchTmdbData(imdbId, type) {
        if (!imdbId) return null;
        try {
            const findRes = await http_get(
                `https://api.themoviedb.org/3/find/${encodeURIComponent(imdbId)}?api_key=${TMDB_API_KEY}&external_source=imdb_id`,
                commonHeaders
            );
            const findJson = safeParse(findRes.body, {});
            const result = type === "series"
                ? findJson.tv_results?.[0]
                : findJson.movie_results?.[0] || findJson.tv_results?.[0];
            if (!result?.id) return null;

            const tmdbType = type === "series" ? "tv" : "movie";
            const creditsRes = await http_get(
                `https://api.themoviedb.org/3/${tmdbType}/${result.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
                commonHeaders
            );
            const creditsJson = safeParse(creditsRes.body, {});
            const actors = Array.isArray(creditsJson.cast)
                ? creditsJson.cast.slice(0, 12).map(person => new Actor({
                    name: person.name || person.original_name || "Unknown",
                    role: person.character || "",
                    image: person.profile_path ? `${TMDB_IMAGE_BASE}${person.profile_path}` : ""
                }))
                : [];

            return {
                backdrop: result.backdrop_path ? `${TMDB_IMAGE_BASE}${result.backdrop_path}` : "",
                poster: result.poster_path ? `${TMDB_IMAGE_BASE}${result.poster_path}` : "",
                year: result.release_date || result.first_air_date ? parseInt((result.release_date || result.first_air_date).slice(0, 4), 10) : undefined,
                score: typeof result.vote_average === "number" ? result.vote_average : undefined,
                actors
            };
        } catch (_) {
            return null;
        }
    }

    function toItemFromAnchor(anchor, fallbackType) {
        const title = normalizeTitle(text(anchor.querySelector("span.mtl")) || text(anchor));
        const href = absUrl(anchor.getAttribute("href"));
        const img = anchor.querySelector("img");
        const poster = absUrl(img?.getAttribute("data-src") || img?.getAttribute("src")) || DEFAULT_POSTER;
        const inferredType = href.includes("/watch-series") || href.includes("/series/") ? "series" : (fallbackType || "movie");

        if (!title || !href) return null;

        return new MultimediaItem({
            title,
            url: href,
            posterUrl: poster,
            type: inferredType
        });
    }

    async function getHome(cb) {
        try {
            const categories = [
                { path: "watch-movies-recent", name: "Recently Updated Movies", type: "movie" },
                { path: "watch-series-recent", name: "Recently Updated Series", type: "series" },
                { path: "watch-movies-popular", name: "Popular Movies", type: "movie" },
                { path: "watch-series-popular", name: "Popular Series", type: "series" }
            ];

            const results = {};
            await Promise.all(categories.map(async category => {
                try {
                    const res = await http_get(`${manifest.baseUrl}/${category.path}?p=1`, commonHeaders);
                    const doc = await parseHtml(res.body);
                    const anchors = Array.from(doc.querySelectorAll("#xbrd > div:nth-child(4) a"));
                    const items = dedupeByUrl(anchors.map(anchor => toItemFromAnchor(anchor, category.type)).filter(Boolean));
                    if (items.length) results[category.name] = items;
                } catch (e) {
                    console.error(`[myownplugin] getHome ${category.name}: ${e.message}`);
                }
            }));

            cb({ success: true, data: results });
        } catch (e) {
            cb({ success: false, errorCode: "HOME_ERROR", message: e.message });
        }
    }

    async function search(query, cb) {
        try {
            const body = `z=${encodeURIComponent(SEARCH_FORM_DEFAULTS.z)}&x=${encodeURIComponent(SEARCH_FORM_DEFAULTS.x)}&q=${encodeURIComponent(query)}`;
            const searchHeaders = {
                ...commonHeaders,
                "Content-Type": "application/x-www-form-urlencoded"
            };
            const res = await http_post(`${manifest.baseUrl}/xmre.php`, searchHeaders, body);
            const doc = await parseHtml(res.body);
            const anchors = Array.from(doc.querySelectorAll("li a"));

            const items = await Promise.all(anchors.map(async anchor => {
                try {
                    const href = absUrl(anchor.getAttribute("href"));
                    const rawTitle = text(anchor);
                    if (!href || !rawTitle) return null;

                    const detailRes = await http_get(href, searchHeaders);
                    const detailDoc = await parseHtml(detailRes.body);
                    const poster = absUrl(detailDoc.querySelector("div.imrl img")?.getAttribute("src")) || DEFAULT_POSTER;
                    const finalHref = absUrl(detailDoc.querySelector("div.snfo h1 a")?.getAttribute("href")) || href;
                    const type = finalHref.includes("/watch-series") || finalHref.includes("/series/") ? "series" : "movie";

                    return new MultimediaItem({
                        title: normalizeTitle(rawTitle),
                        url: finalHref,
                        posterUrl: poster,
                        type
                    });
                } catch (_) {
                    return null;
                }
            }));

            cb({ success: true, data: dedupeByUrl(items.filter(Boolean)) });
        } catch (e) {
            cb({ success: false, errorCode: "SEARCH_ERROR", message: e.message });
        }
    }

    async function load(url, cb) {
        try {
            const res = await http_get(url, commonHeaders);
            const doc = await parseHtml(res.body);

            const rawHeading = text(doc.querySelector("div.marl h1"));
            const title = normalizeTitle(rawHeading);
            const year = parseYearFromTitle(rawHeading);
            const poster = absUrl(doc.querySelector("#poster img")?.getAttribute("src")) || DEFAULT_POSTER;
            const description = text(doc.querySelector("div.fimm p"));
            const hasSeasons = doc.querySelectorAll("#sesh a.ste, #sesh button").length > 0;
            const type = hasSeasons ? "series" : "movie";
            const imdbRaw = doc.querySelector("#imdb")?.getAttribute("data-ubv") || "";
            const imdbId = imdbRaw.split(",")[0] || "";

            const tmdb = await fetchTmdbData(imdbId, type);

            if (!hasSeasons) {
                const episodes = [
                    new Episode({
                        name: "Full Movie",
                        season: 1,
                        episode: 1,
                        url,
                        posterUrl: tmdb?.poster || poster
                    })
                ];

                return cb({
                    success: true,
                    data: new MultimediaItem({
                        title,
                        url,
                        posterUrl: tmdb?.poster || poster,
                        bannerUrl: tmdb?.backdrop || "",
                        description,
                        year: tmdb?.year || year,
                        score: tmdb?.score,
                        type: "movie",
                        cast: tmdb?.actors || [],
                        syncData: imdbId ? { imdb: imdbId } : undefined,
                        episodes
                    })
                });
            }

            const seasonAnchor = doc.querySelector("#sesh a.ste");
            const firstSeasonHref = absUrl(seasonAnchor?.getAttribute("href"));
            const totalSeasons = parseInt((firstSeasonHref.split("?s=")[1] || "1"), 10) || 1;
            const episodes = [];

            for (let season = 1; season <= totalSeasons; season++) {
                const seasonUrl = firstSeasonHref
                    ? `${firstSeasonHref.split("?s=")[0]}?s=${season}`
                    : `${url}?s=${season}`;
                try {
                    const seasonRes = await http_get(seasonUrl, commonHeaders);
                    const seasonDoc = await parseHtml(seasonRes.body);
                    const episodeCards = Array.from(seasonDoc.querySelectorAll("div.seho"));

                    episodeCards.forEach(card => {
                        const href = absUrl(card.querySelector("a")?.getAttribute("href"));
                        const label = text(card.querySelector("a"));
                        const episodeText = text(card.querySelector("span.sea"));
                        const episodeNumber = parseInt((episodeText.match(/(\d+)/) || [])[1], 10) || episodes.length + 1;
                        if (!href) return;

                        episodes.push(new Episode({
                            name: label || `Episode ${episodeNumber}`,
                            url: href,
                            season,
                            episode: episodeNumber,
                            posterUrl: tmdb?.poster || poster
                        }));
                    });
                } catch (e) {
                    console.error(`[myownplugin] season ${season}: ${e.message}`);
                }
            }

            cb({
                success: true,
                data: new MultimediaItem({
                    title,
                    url,
                    posterUrl: tmdb?.poster || poster,
                    bannerUrl: tmdb?.backdrop || "",
                    description,
                    year: tmdb?.year || year,
                    score: tmdb?.score,
                    type: "series",
                    cast: tmdb?.actors || [],
                    syncData: imdbId ? { imdb: imdbId } : undefined,
                    episodes: dedupeByUrl(episodes)
                })
            });
        } catch (e) {
            cb({ success: false, errorCode: "LOAD_ERROR", message: e.message });
        }
    }

    async function extractStreamplay(url, referer, streams) {
        try {
            const res = await http_get(url, { ...commonHeaders, "Referer": referer || manifest.baseUrl });
            const body = res.body || "";
            const sitekey = body.match(/sitekey:\s*'([^']+)'/)?.[1];
            if (!sitekey) return;
            const token = await solveCaptcha(sitekey, url);
            if (!token) return;

            const redirectUrl = res.finalUrl || url;
            const parsed = new URL(redirectUrl);
            const mainServer = `${parsed.protocol}//${parsed.host}`;
            const key = redirectUrl.split("embed-")[1]?.split(".html")[0];
            if (!key) return;

            const postBody = `op=embed&token=${encodeURIComponent(token)}`;
            const playerRes = await http_post(
                `${mainServer}/player-${key}-488x286.html`,
                {
                    ...commonHeaders,
                    "Referer": redirectUrl,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                postBody
            );

            const script = playerRes.body || "";
            const sourceMatches = Array.from(script.matchAll(/file\s*:\s*["']([^"']+)["'][^}]*label\s*:\s*["']([^"']+)["']/g));
            sourceMatches.forEach(match => {
                streams.push(new StreamResult({
                    url: match[1],
                    quality: qualityFromLabel(match[2]),
                    source: `Streamplay [${match[2]}]`,
                    headers: {
                        "Referer": `${mainServer}/`,
                        "Range": "bytes=0-",
                        "User-Agent": DEFAULT_UA
                    }
                }));
            });
        } catch (e) {
            console.error(`[myownplugin] streamplay: ${e.message}`);
        }
    }

    async function extractWootly(url, referer, streams) {
        try {
            const res = await http_get(url, commonHeaders);
            const doc = await parseHtml(res.body);
            const iframe = doc.querySelector("iframe")?.getAttribute("src");
            if (!iframe) return;

            const iframeRes = await http_post(
                iframe,
                {
                    ...commonHeaders,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": url
                },
                "qdfx=1"
            );
            const html = iframeRes.body || "";
            const vd = html.match(/var\s+vd\s*=\s*["']([^"']+)["']/)?.[1];
            const tk = html.match(/tk\s*=\s*["']([^"']+)["']/)?.[1];
            if (!vd || !tk) return;

            const grabRes = await http_get(`https://web.wootly.ch/grabm?t=${encodeURIComponent(tk)}&id=${encodeURIComponent(vd)}`, {
                ...commonHeaders,
                "Referer": iframe
            });
            const finalUrl = (grabRes.body || "").trim();
            if (!finalUrl.startsWith("http")) return;

            streams.push(new StreamResult({
                url: finalUrl,
                quality: "720p",
                source: "Wootly",
                headers: {
                    "Referer": referer || url,
                    "User-Agent": DEFAULT_UA
                }
            }));
        } catch (e) {
            console.error(`[myownplugin] wootly: ${e.message}`);
        }
    }

    async function extractGeneric(url, referer, streams) {
        if (!url) return;
        try {
            const lower = url.toLowerCase();
            if (lower.includes("streamplay")) return extractStreamplay(url, referer, streams);
            if (lower.includes("wootly")) return extractWootly(url, referer, streams);
            if (/\.(m3u8|mp4)(\?|$)/i.test(url)) {
                streams.push(new StreamResult({
                    url,
                    quality: qualityFromLabel(url),
                    source: "Direct",
                    headers: referer ? { "Referer": referer, "User-Agent": DEFAULT_UA } : { "User-Agent": DEFAULT_UA }
                }));
                return;
            }

            const res = await http_get(url, referer ? { ...commonHeaders, "Referer": referer } : commonHeaders);
            const body = res.body || "";

            const directMatch = body.match(/sources?\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i)
                || body.match(/file\s*:\s*["']([^"']+\.(?:m3u8|mp4)(?:\?[^"']*)?)["']/i);
            if (directMatch?.[1]) {
                streams.push(new StreamResult({
                    url: directMatch[1],
                    quality: qualityFromLabel(body),
                    source: "Direct",
                    headers: { "Referer": url, "User-Agent": DEFAULT_UA }
                }));
                return;
            }

            const iframeMatches = Array.from(body.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)).map(match => absUrl(match[1]));
            for (const iframeUrl of iframeMatches) {
                if (iframeUrl !== url) await extractGeneric(iframeUrl, url, streams);
            }
        } catch (e) {
            console.error(`[myownplugin] generic extractor: ${e.message}`);
        }
    }

    async function loadStreams(url, cb) {
        try {
            const initialRes = await http_get(url, { ...commonHeaders, "Referer": manifest.baseUrl });
            const html = initialRes.body || "";
            const doc = await parseHtml(html);
            const cookies = parseSetCookieHeader(initialRes.headers?.["set-cookie"] || initialRes.headers?.["Set-Cookie"]);
            const pair = extract3chkPair(html);
            const cookieHeader = buildCookieHeader(cookies.aGooz, pair);

            const downloadLinks = Array.from(doc.querySelectorAll("#drl a"))
                .map(anchor => absUrl(anchor.getAttribute("href")))
                .filter(Boolean);
            const streams = [];

            for (const link of downloadLinks) {
                try {
                    const redirectRes = await http_get(link, {
                        ...commonHeaders,
                        "Referer": manifest.baseUrl,
                        ...(cookieHeader ? { "Cookie": cookieHeader } : {})
                    });
                    const candidate = redirectRes.headers?.location
                        || redirectRes.headers?.Location
                        || redirectRes.finalUrl
                        || "";
                    if (candidate) await extractGeneric(candidate, link, streams);
                } catch (e) {
                    console.error(`[myownplugin] loadStreams link: ${e.message}`);
                }
            }

            cb({ success: true, data: dedupeByUrl(streams) });
        } catch (e) {
            cb({ success: false, errorCode: "STREAM_ERROR", message: e.message });
        }
    }

    globalThis.getHome = getHome;
    globalThis.search = search;
    globalThis.load = load;
    globalThis.loadStreams = loadStreams;
})();
