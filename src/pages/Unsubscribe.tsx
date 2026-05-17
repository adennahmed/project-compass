/**
 * Email unsubscribe landing.
 *
 * The original Lovable-managed email queue + backing tables have been
 * removed; this page is now a static "you're already unsubscribed"
 * surface so any legacy URLs that get clicked still render gracefully.
 *
 * Future: when we wire up our own transactional email pipeline via
 * Resend, re-add the unsubscribe-token validation here.
 */
const Unsubscribe = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#F1EEE5" }}
    >
      <div className="max-w-md w-full px-8 py-12 text-center">
        <h1
          className="text-[16px] font-bold tracking-[0.12em] uppercase mb-12"
          style={{ color: "#0F0F12" }}
        >
          KOZAI
        </h1>
        <h2
          className="text-[22px] font-bold uppercase mb-4"
          style={{ color: "#0F0F12" }}
        >
          Unsubscribed
        </h2>
        <p
          className="text-[14px]"
          style={{ color: "rgba(15,15,18,0.55)", lineHeight: "1.8" }}
        >
          You're not on any of our marketing lists. We only email people
          who've reached out through our contact form, and only as a
          direct reply.
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-2.5 text-[11px] uppercase tracking-[0.18em]"
          style={{
            border: "1px solid rgba(15,15,18,0.2)",
            color: "#0F0F12",
            textDecoration: "none",
          }}
        >
          Back to kozai.ca ↘
        </a>
      </div>
    </div>
  );
};

export default Unsubscribe;
