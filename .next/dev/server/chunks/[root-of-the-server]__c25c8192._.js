module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/pastebin/lib/pasteUtils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deletePaste",
    ()=>deletePaste,
    "escapeHtml",
    ()=>escapeHtml,
    "generateId",
    ()=>generateId,
    "getCurrentTime",
    ()=>getCurrentTime,
    "getCurrentTimeFromRequest",
    ()=>getCurrentTimeFromRequest,
    "getPaste",
    ()=>getPaste,
    "incrementPasteViews",
    ()=>incrementPasteViews,
    "isPasteExpired",
    ()=>isPasteExpired,
    "isViewLimitExceeded",
    ()=>isViewLimitExceeded,
    "savePaste",
    ()=>savePaste
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pastebin/node_modules/@vercel/kv/dist/index.js [app-route] (ecmascript)");
;
const TEST_MODE = process.env.TEST_MODE === '1';
function getCurrentTime() {
    return Date.now();
}
function getCurrentTimeFromRequest(req) {
    if (TEST_MODE && req.headers['x-test-now-ms']) {
        const testTime = parseInt(req.headers['x-test-now-ms'], 10);
        if (!isNaN(testTime)) {
            return testTime;
        }
    }
    return getCurrentTime();
}
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m)=>map[m]);
}
async function getPaste(id) {
    const kvKey = `paste:${id}`;
    const pasteJson = await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].get(kvKey);
    return pasteJson ? JSON.parse(pasteJson) : null;
}
async function savePaste(id, pasteData, ttlSeconds = null) {
    const kvKey = `paste:${id}`;
    if (ttlSeconds) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].setex(kvKey, ttlSeconds, JSON.stringify(pasteData));
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].set(kvKey, JSON.stringify(pasteData));
    }
}
async function deletePaste(id) {
    const kvKey = `paste:${id}`;
    await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].del(kvKey);
}
function isPasteExpired(paste, now) {
    if (!paste.expiresAt) return false;
    const expiryTime = new Date(paste.expiresAt).getTime();
    return now >= expiryTime;
}
function isViewLimitExceeded(paste) {
    if (paste.maxViews === null) return false;
    return paste.currentViews >= paste.maxViews;
}
async function incrementPasteViews(id, paste, now) {
    paste.currentViews = (paste.currentViews || 0) + 1;
    const remainingTTL = paste.expiresAt ? Math.max(0, Math.floor((new Date(paste.expiresAt).getTime() - now) / 1000)) : null;
    if (remainingTTL && remainingTTL > 0) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].setex(`paste:${id}`, remainingTTL, JSON.stringify(paste));
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].set(`paste:${id}`, JSON.stringify(paste));
    }
    return paste;
}
}),
"[project]/pastebin/app/api/pastes/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$lib$2f$pasteUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pastebin/lib/pasteUtils.js [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { content, ttl_seconds, max_views } = body;
        // Validation
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return Response.json({
                error: 'content is required and must be a non-empty string'
            }, {
                status: 400
            });
        }
        if (ttl_seconds !== undefined) {
            if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
                return Response.json({
                    error: 'ttl_seconds must be an integer >= 1'
                }, {
                    status: 400
                });
            }
        }
        if (max_views !== undefined) {
            if (!Number.isInteger(max_views) || max_views < 1) {
                return Response.json({
                    error: 'max_views must be an integer >= 1'
                }, {
                    status: 400
                });
            }
        }
        // Generate ID and URL
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$lib$2f$pasteUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])();
        const headers = Object.fromEntries(request.headers.entries());
        const baseUrl = process.env.BASE_URL || (headers['x-forwarded-proto'] || 'http') + '://' + headers.host || 'http://localhost:3000';
        const url = `${baseUrl}/p/${id}`;
        // Calculate expiry time
        const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$lib$2f$pasteUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentTime"])();
        const expiresAt = ttl_seconds ? new Date(now + ttl_seconds * 1000).toISOString() : null;
        // Store paste data
        const pasteData = {
            content: content.trim(),
            createdAt: now,
            expiresAt,
            maxViews: max_views || null,
            currentViews: 0
        };
        // Store in KV
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$pastebin$2f$lib$2f$pasteUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["savePaste"])(id, pasteData, ttl_seconds);
        return Response.json({
            id,
            url
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating paste:', error);
        return Response.json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c25c8192._.js.map