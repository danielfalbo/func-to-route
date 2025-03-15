"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [getResponse, setGetResponse] = useState("");
  const [postResponse, setPostResponse] = useState("");
  const [apiKey, setApiKey] = useState("");

  const testGet = async () => {
    try {
      const res = await fetch("/api/hello");
      const data = await res.json();
      setGetResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setGetResponse(String(error));
    }
  };

  const testPost = async () => {
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setPostResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setPostResponse(String(error));
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">func-to-route Test UI</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">GET Test (No Auth)</h2>
          <button
            onClick={testGet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test GET
          </button>
          <pre className="bg-gray-100 p-4 rounded">
            {getResponse || "Response will appear here"}
          </pre>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">POST Test (API Key Auth)</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={testPost}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test POST
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded">
            {postResponse || "Response will appear here"}
          </pre>
        </section>
      </div>
    </main>
  );
}
