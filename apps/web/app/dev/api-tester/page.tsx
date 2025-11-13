"use client";

import { useState } from "react";

// METHOD LIST
const routers = {
  post: ["getPosts", "createPost"],
  like: ["toggleLike"],
  comment: ["addComment"],
  upload: ["getPresignedUrl"],
  user: ["getCurrentUser"],
};

// MUTATION/QUERY TYPE MAP
const routerTypes = {
  post: {
    getPosts: "query",
    createPost: "mutation",
  },
  like: {
    toggleLike: "mutation",
  },
  comment: {
    addComment: "mutation",
  },
  upload: {
    getPresignedUrl: "query",
  },
  user: {
    getCurrentUser: "query",
  },
} as const;

export default function ApiTester() {
  const [selectedRouter, setSelectedRouter] = useState<keyof typeof routers>("post");
  const [selectedMethod, setSelectedMethod] = useState<string>("getPosts");
  const [input, setInput] = useState("{}");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    try {
      const parsed = input ? JSON.parse(input) : {};

      const path = `${selectedRouter}.${selectedMethod}`;
      const isMutation = routerTypes[selectedRouter][selectedMethod] === "mutation";

      let url = `/api/trpc/${path}`;

      if (!isMutation) {
        url += `?input=${encodeURIComponent(JSON.stringify(parsed))}`;
      }

      const res = await fetch(url, {
        method: isMutation ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: isMutation ? JSON.stringify({ input: parsed }) : undefined,
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponse(err.message);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>tRPC API Tester</h1>

      <div style={{ marginTop: 20 }}>
        <label>Router</label>
        <select
          value={selectedRouter}
          onChange={(e) => {
            const router = e.target.value as keyof typeof routers;
            setSelectedRouter(router);
            setSelectedMethod(routers[router][0]);
          }}
        >
          {Object.keys(routers).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Method</label>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          {routers[selectedRouter].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Input JSON</label>
        <textarea
          rows={8}
          style={{ width: "100%", padding: 10 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
        }}
        onClick={sendRequest}
      >
        Send Request
      </button>

      <h2 style={{ marginTop: 30 }}>Response:</h2>
      <pre
        style={{
          background: "#111",
          color: "lime",
          padding: 20,
          borderRadius: 6,
          minHeight: 150,
        }}
      >
        {response}
      </pre>
    </div>
  );
}
