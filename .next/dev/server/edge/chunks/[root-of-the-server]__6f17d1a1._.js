(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__6f17d1a1._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'stream', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`stream`));
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'crypto', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`crypto`));
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/auth.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getTokenFromCookies",
    ()=>getTokenFromCookies,
    "setAuthCookie",
    ()=>setAuthCookie,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
async function generateToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });
}
async function verifyToken(token) {
    try {
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        console.log('Verified token payload:', res);
        return res;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}
async function getTokenFromCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get('auth_token')?.value;
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
    });
}
async function getCurrentUser() {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return await verifyToken(token);
}
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/auth.ts [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // Public routes that don't need authentication
    const publicRoutes = [
        '/login',
        '/register'
    ];
    const isPublicRoute = publicRoutes.includes(pathname);
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;
    // If no token and not public route, redirect to login
    if (!token && !isPublicRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
    }
    // If token exists, verify it
    if (token) {
        const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        console.log('Decoded token in middleware:', decoded);
        if (!decoded) {
            // Token invalid, redirect to login
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token');
            return response;
        }
        // Check role-based routing
        if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', request.url));
        }
        if (pathname.startsWith('/teacher') && decoded.role !== 'teacher' && decoded.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', request.url));
        }
        if (pathname.startsWith('/student') && decoded.role !== 'student' && decoded.role !== 'admin' && decoded.role !== 'teacher') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', request.url));
        }
    }
    // Allow public routes to be accessed
    if (isPublicRoute && token) {
        const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (decoded) {
            // Redirect authenticated users away from login/register
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/${decoded.role}/dashboard`, request.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__6f17d1a1._.js.map