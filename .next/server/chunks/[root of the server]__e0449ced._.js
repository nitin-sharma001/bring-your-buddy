module.exports = {

"[project]/.next-internal/server/app/api/scan-documents/eligibility/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/scan-documents/eligibility/route.ts [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
async function processFile(filePath) {
    try {
        const base64File = fs.readFileSync(filePath, {
            encoding: "base64"
        });
        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            headers: {
                apikey: process.env.OCR_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                base64image: `data:application/pdf;base64,${base64File}`,
                isOverlayRequired: "true",
                language: "eng"
            })
        });
        const result = await ocrResponse.json();
        if (!result || !result.ParsedResults) {
            return {
                error: "OCR API failed",
                percentage: null
            };
        }
        const extractedText = result.ParsedResults[0]?.ParsedText || "";
        console.log("Extracted OCR Text:\n", extractedText);
        // Improved regex to extract only valid subjects and marks
        const marksPattern = /([A-Za-z\s]{3,30})\s+(\d{1,3})\s*\/\s*(\d{2,3})/g;
        let match;
        let extractedMarks = [];
        while((match = marksPattern.exec(extractedText)) !== null){
            let subject = match[1].trim();
            let obtainedMarks = parseInt(match[2], 10);
            let subjectTotalMarks = parseInt(match[3], 10);
            extractedMarks.push({
                subject,
                obtainedMarks,
                subjectTotalMarks
            });
        }
        // Remove irrelevant subjects
        const unwantedWords = [
            "certificate",
            "qualification",
            "mark sheet",
            "examination",
            "bhiwani"
        ];
        extractedMarks = extractedMarks.filter((entry)=>!unwantedWords.some((word)=>entry.subject.toLowerCase().includes(word)));
        // Calculate valid total marks
        const validMarks = extractedMarks.filter((entry)=>entry.subjectTotalMarks >= 50 && entry.subjectTotalMarks <= 100);
        const totalObtained = validMarks.reduce((sum, entry)=>sum + entry.obtainedMarks, 0);
        const totalMarks = validMarks.reduce((sum, entry)=>sum + entry.subjectTotalMarks, 0);
        if (totalMarks === 0) return {
            error: "No valid marks found",
            percentage: null
        };
        const percentage = totalObtained / totalMarks * 100;
        return {
            marks: validMarks,
            percentage: parseFloat(percentage.toFixed(2))
        };
    } catch (error) {
        console.error("Error processing file:", error);
        return {
            error: "Error processing file",
            percentage: null
        };
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__e0449ced._.js.map