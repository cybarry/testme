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
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongodb URI to .env.local');
}
const uri = process.env.MONGODB_URI;
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(uri, opts);
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/schemas/exam.schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Exam",
    ()=>Exam
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const examSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    bankId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required: true
    },
    questions: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    duration: {
        type: Number,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    passingScore: {
        type: Number,
        default: 500
    },
    createdBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const Exam = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Exam || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Exam', examSchema);
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/schemas/question.schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Question",
    ()=>Question,
    "QuestionType",
    ()=>QuestionType
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
var QuestionType = /*#__PURE__*/ function(QuestionType) {
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["SINGLE_CHOICE"] = "single_choice";
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["DRAG_DROP"] = "drag_drop";
    return QuestionType;
}({});
const questionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    questionText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(QuestionType),
        required: true
    },
    options: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.Mixed,
    answer: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.Mixed,
    explanation: String,
    bankId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required: true
    }
}, {
    timestamps: true
});
const Question = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Question || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Question', questionSchema);
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getTokenFromCookies",
    ()=>getTokenFromCookies,
    "removeAuthCookie",
    ()=>removeAuthCookie,
    "setAuthCookie",
    ()=>setAuthCookie,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/jose@6.1.2/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-here-change-in-prod';
const encodedKey = new TextEncoder().encode(JWT_SECRET);
async function generateToken(payload) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('24h').sign(encodedKey);
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$2$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, encodedKey, {
            algorithms: [
                'HS256'
            ]
        });
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}
async function getTokenFromCookies() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        return cookieStore.get('auth_token')?.value;
    } catch  {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60
    });
}
async function getCurrentUser() {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return await verifyToken(token);
}
async function removeAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('auth_token');
}
}),
"[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/app/api/teacher/exams/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$schemas$2f$exam$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/schemas/exam.schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$schemas$2f$question$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/schemas/question.schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cybarry Solutions/2025 Q3/projects/testme/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
    try {
        const currentUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!currentUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 403
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const query = currentUser.role === 'teacher' ? {
            createdBy: currentUser.userId
        } : {};
        const exams = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$schemas$2f$exam$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Exam"].find(query).populate('bankId').sort({
            createdAt: -1
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            exams
        }, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch exams'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const currentUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!currentUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 403
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const { title, description, bankId, duration, passingScore } = await request.json();
        // Get questions from bank
        const questions = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$schemas$2f$question$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Question"].find({
            bankId
        });
        if (questions.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No questions in bank'
            }, {
                status: 400
            });
        }
        // Shuffle and select questions
        const shuffled = questions.sort(()=>Math.random() - 0.5);
        const exam = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$lib$2f$schemas$2f$exam$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Exam"]({
            title,
            description,
            bankId,
            questions: shuffled.map((q)=>q._id),
            duration,
            passingScore: passingScore || 500,
            createdBy: currentUser.userId,
            published: false
        });
        await exam.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            exam
        }, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cybarry__Solutions$2f$2025__Q3$2f$projects$2f$testme$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to create exam'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__58d9af6d._.js.map