import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  console.error("[boot] #root not found");
} else {
  try {
    createRoot(root).render(
      <>
        <App />
        <Analytics />
      </>,
    );
  } catch (err) {
    // Last-resort recovery. If even mounting React fails, render a raw
    // HTML page so the user never sees a literal blank tab.
    console.error("[boot] React failed to mount:", err);
    const msg = err instanceof Error ? err.message : String(err);
    root.innerHTML = `
      <div style="min-height:100vh;background:#0E0E10;color:#F5F2EC;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:10vh 6vw;display:flex;flex-direction:column;gap:1.25rem;align-items:flex-start">
        <div style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:rgba(245,242,236,0.55)">↘ Boot error</div>
        <h1 style="margin:0;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:600;letter-spacing:-0.04em;line-height:1.05">The site failed to start.</h1>
        <p style="margin:0;max-width:62ch;font-size:15px;line-height:1.6;color:rgba(245,242,236,0.7)">Try a hard refresh (⌘⇧R or Ctrl+Shift+R). If the problem persists, open the browser console (⌥⌘I) and send the error message to hello@kozai.ca.</p>
        <pre style="margin:0;padding:0.75rem 1rem;border:1px solid rgba(245,242,236,0.12);background:rgba(0,0,0,0.35);font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:12px;color:#E84F1B;overflow-x:auto;max-width:100%">${msg.replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;"))}</pre>
        <div style="display:flex;gap:0.75rem"><button onclick="location.reload()" style="background:#F5F2EC;color:#0E0E10;border:1px solid #F5F2EC;padding:10px 18px;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;cursor:pointer">Reload ↘</button></div>
      </div>
    `;
  }
}
