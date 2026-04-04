(function () {

    async function getHome(cb) {
        try {
            const url = manifest.baseUrl + "/wefeed-mobile-bff/tab/ranking-list?tabId=0&categoryType=4516404531735022304&page=1&perPage=15";
            const resp = await http_get(url, {
                "user-agent": "com.community.mbox.in/50020042 (Linux; U; Android 16; en_IN; sdk_gphone64_x86_64; Build/BP22.250325.006; Cronet/133.0.6876.3)",
                "accept": "application/json"
            });
            
            if (resp.status !== 200) {
                cb({ success: false, errorCode: "HTTP_ERROR", message: "Status: " + resp.status + " Body: " + (resp.body || "").substring(0, 200) });
                return;
            }

            const root = JSON.parse(resp.body);
            const raw = (root.data && (root.data.items || root.data.subjects)) || [];
            const items = raw.map(function(item) {
                return new MultimediaItem({
                    title: (item.title || "Unknown").split("[")[0].trim(),
                    url: item.subjectId || "",
                    posterUrl: (item.cover && item.cover.url) ? item.cover.url : "",
                    type: item.subjectType === 2 ? "series" : "movie"
                });
            }).filter(function(i) { return i.url; });

            cb({ success: true, data: { "Trending": items } });
        } catch (e) {
            cb({ success: false, errorCode: "EXCEPTION", message: e.message });
        }
    }

    async function search(query, cb) {
        cb({ success: true, data: [] });
    }

    async function load(url, cb) {
        cb({ success: false, errorCode: "NOT_IMPL", message: "Not implemented yet" });
    }

    async function loadStreams(url, cb) {
        cb({ success: false, errorCode: "NOT_IMPL", message: "Not implemented yet" });
    }

    globalThis.getHome    = getHome;
    globalThis.search     = search;
    globalThis.load       = load;
    globalThis.loadStreams = loadStreams;

})();
