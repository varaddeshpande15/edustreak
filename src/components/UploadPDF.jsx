"use client";
import { useState, useEffect } from "react";

export default function UploadPDF() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => console.log("PDF.js loaded");
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async function (e) {
            const arrayBuffer = e.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);

            if (!window.pdfjsLib) {
                console.error("PDF.js library not loaded.");
                setLoading(false);
                return;
            }

            const loadingTask = window.pdfjsLib.getDocument({ data: uint8Array });
            loadingTask.promise.then(async (pdf) => {
                let extractedText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    textContent.items.forEach((textItem) => {
                        extractedText += textItem.str + " ";
                    });
                    extractedText += "\n";
                }
                setText(extractedText);
                setLoading(false);
                sendToGeminiAPI(extractedText); // Send extracted text to Gemini API
            });
        };

        reader.readAsArrayBuffer(file);
    };

    const sendToGeminiAPI = async (pdfText) => {
        setLoading(true);
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: pdfText }),
            });

            const data = await response.json();
            setSchedule(data.schedule); // Update the state with generated schedule
        } catch (error) {
            console.error("Error sending data to Gemini:", error);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="mb-4 border p-2" />
            {loading ? <p>Processing...</p> : <pre className="whitespace-pre-wrap p-2 border">{text}</pre>}
            <h2 className="mt-4 font-bold">Generated Schedule:</h2>
            <pre className="whitespace-pre-wrap p-2 border">{schedule}</pre>
        </div>
    );
}
