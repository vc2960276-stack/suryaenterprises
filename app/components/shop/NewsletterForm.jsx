"use client";

import { Send } from "lucide-react";
import { toast } from "../../lib-shop/toast";

// Newsletter isn't live yet: no data is collected or sent anywhere.
export default function NewsletterForm({ compact = false }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast("Newsletter sign-up is coming soon.");
      }}
      className="flex gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder={compact ? "Newsletter — your email" : "Your email"}
        className={`${compact ? "h-9 text-[13px]" : "h-10 text-sm"} min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/60 outline-none focus:border-harvest`}
      />
      <button type="submit" className={`btn btn-cart ${compact ? "h-9" : "h-10"} px-3`} aria-label="Subscribe (coming soon)">
        <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </form>
  );
}
