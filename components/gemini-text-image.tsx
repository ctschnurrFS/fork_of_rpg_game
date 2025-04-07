"use client";
import { useCallGemini } from "@/lib/useCallGemini";
import { useState } from "react";

export default function GeminiComponent() {
    const { queryGemini, responseText, imageUrl, loading, error } = useCallGemini();
    const [input, setInput] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            await queryGemini(input);
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Enter your RPG prompt..."
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 p-2 bg-blue-600 text-white rounded"
                >
                    {loading ? "Loading..." : "Generate"}
                </button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {responseText && (
                <div className="mt-4 p-2 border rounded bg-gray-100">
                    <p>{responseText}</p>
                </div>
            )}

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Generated"
                    className="mt-4 border rounded"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            )}
        </div>
    );
}
