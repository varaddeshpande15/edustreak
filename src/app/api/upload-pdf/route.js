// import pdfParse from "pdf-parse";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     try {
//         const formData = await req.formData();
//         const file = formData.get("pdf");

//         if (!file) {
//             return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//         }

//         const arrayBuffer = await file.arrayBuffer();
//         const pdfData = await pdfParse(Buffer.from(arrayBuffer));

//         return NextResponse.json({ text: pdfData.text });
//     } catch (error) {
//         console.error("Error processing PDF:", error);
//         return NextResponse.json({ error: "Failed to extract text" }, { status: 500 });
//     }
// }
