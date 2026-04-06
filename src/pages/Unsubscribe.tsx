import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080808" }}>
      <div className="max-w-md w-full px-8 py-12 text-center">
        <h1
          className="text-[16px] font-bold tracking-[0.12em] uppercase mb-12"
          style={{ color: "#ffffff" }}
        >
          KOZAI
        </h1>

        {status === "loading" && (
          <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Validating your request...
          </p>
        )}

        {status === "valid" && (
          <>
            <h2 className="text-[22px] font-bold uppercase mb-4" style={{ color: "#ffffff" }}>
              Unsubscribe
            </h2>
            <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>
              Are you sure you want to unsubscribe from Kozai emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="inline-block px-8 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors"
              style={{
                border: "1px solid rgba(200,169,110,0.3)",
                color: "#C8A96E",
                background: "transparent",
              }}
            >
              Confirm Unsubscribe
            </button>
          </>
        )}

        {status === "already" && (
          <>
            <h2 className="text-[22px] font-bold uppercase mb-4" style={{ color: "#ffffff" }}>
              Already Unsubscribed
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>
              You've already been unsubscribed from Kozai emails.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-[22px] font-bold uppercase mb-4" style={{ color: "#ffffff" }}>
              Unsubscribed
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>
              You've been successfully unsubscribed. You will no longer receive emails from Kozai.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <h2 className="text-[22px] font-bold uppercase mb-4" style={{ color: "#ffffff" }}>
              Invalid Link
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-[22px] font-bold uppercase mb-4" style={{ color: "#ffffff" }}>
              Something Went Wrong
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>
              We couldn't process your request. Please try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
