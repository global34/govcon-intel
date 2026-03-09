"use client";

import { FormEvent, useState, useTransition } from "react";

const INTERESTS = ["Opportunities", "Compliance", "Budget", "Teaming"];

type SignupFormProps = {
  source: string;
  compact?: boolean;
};

export function SignupForm({ source, compact = false }: SignupFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const payload = {
      email: String(form.get("email") ?? "").trim(),
      firstName: String(form.get("firstName") ?? "").trim(),
      company: String(form.get("company") ?? "").trim(),
      source,
      interests: form.getAll("interests").map((item) => String(item)),
    };

    startTransition(async () => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setError(body.error ?? "Signup failed.");
        return;
      }

      formElement.reset();
      setMessage(body.message ?? "You are subscribed.");
    });
  }

  return (
    <form className={`signup-form${compact ? " signup-form--compact" : ""}`} onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" placeholder="you@company.com" required />
      </label>
      <label>
        First name
        <input name="firstName" type="text" placeholder="Optional" />
      </label>
      <label>
        Company
        <input name="company" type="text" placeholder="Optional" />
      </label>
      <fieldset>
        <legend>What do you want first?</legend>
        <div className="checkbox-grid">
          {INTERESTS.map((interest) => (
            <label key={interest} className="checkbox-pill">
              <input name="interests" type="checkbox" value={interest} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button button--primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Subscribe to the weekly brief"}
      </button>
      <p className="form-meta">Weekly cadence. No purchased lists. Unsubscribe anytime.</p>
      {message ? <p className="form-message form-message--success">{message}</p> : null}
      {error ? <p className="form-message form-message--error">{error}</p> : null}
    </form>
  );
}
