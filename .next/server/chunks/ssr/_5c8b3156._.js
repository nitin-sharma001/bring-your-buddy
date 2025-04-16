module.exports = {

"[project]/.next-internal/server/app/(protectedroute)/checklist/page/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/(protectedroute)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(protectedroute)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/(protectedroute)/checklist/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(protectedroute)/checklist/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/(protectedroute)/checklist/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
const page = ()=>{
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])({
        offer_letter: null,
        admission_letter: null,
        bonafide_certificate: null,
        student_undertaking_form: null
    });
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                [e.target.name]: file
            });
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!formData.id) {
            toast.error("User ID is missing!");
            return;
        }
        setLoading(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key)=>{
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        });
        try {
            toast.loading("Updating profile...");
            const res = await fetch("/api/update-profile", {
                method: "POST",
                body: formDataToSend
            });
            const email = JSON.parse(localStorage.getItem("user")).email;
            axios.post("/api/getuserbyemail", {
                email
            }).then((res)=>{
                console.log(res.data);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            });
            const data = await res.json();
            toast.dismiss();
            setLoading(false);
            if (res.ok) {
                toast.success("Profile updated successfully!");
                localStorage.setItem("document_verified", "0");
                axios.post("/api/documentverify/iseligible/updatetozero", {
                    email
                }).then((res)=>{
                    console.log(res);
                }).catch((err)=>{
                    console.log(err);
                });
                axios.post("/api/documentverify/updatetozero", {
                    email
                }).then((res)=>{
                    console.log(res);
                }).catch((err)=>{
                    console.log(err);
                });
            } else {
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            setLoading(false);
            toast.dismiss();
            toast.error("Failed to update profile");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "checklist"
    }, void 0, false, {
        fileName: "[project]/src/app/(protectedroute)/checklist/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = page;
}}),
"[project]/src/app/(protectedroute)/checklist/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(protectedroute)/checklist/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_5c8b3156._.js.map