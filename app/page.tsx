"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tweet = {
  id: number;
  url: string;
  created_at: string;
};

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

function normalizeTweetUrl(value: string) {
  const clean = value.trim();

  if (!clean) return null;

  const isTweet = clean.includes("twitter.com/") || clean.includes("x.com/");

  if (!isTweet || !clean.includes("/status/")) return null;

  return clean.replace("x.com", "twitter.com");
}

export default function Page() {
  const [tweetUrl, setTweetUrl] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadTweets() {
    const { data, error } = await supabase
      .from("tweets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Could not load tweets.");
      console.error(error);
    } else {
      setTweets(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTweets();
  }, []);

  useEffect(() => {
    const scriptId = "twitter-widgets";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr?.widgets.load();
    }
  }, [tweets]);

  async function addTweet(event: React.FormEvent) {
    event.preventDefault();

    const normalized = normalizeTweetUrl(tweetUrl);

    if (!normalized) {
      alert("Paste a valid X/Twitter post link.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("tweets").insert({
      url: normalized
    });

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        alert("This tweet is already added.");
      } else {
        alert("Could not add tweet.");
        console.error(error);
      }

      return;
    }

    setTweetUrl("");
    await loadTweets();
  }

  return (
    <main>
      <header className="nav">
        <div className="brand">
          <span className="corner cornerLeft" />
          <strong>AllScale</strong>
          <span className="corner cornerRight" />
        </div>

        <nav>
          <a href="#wall">Feedback</a>
          <a href="#submit">Submit tweet</a>
          <a href="https://www.allscale.io" target="_blank">
            AllScale <ArrowUpRight size={13} />
          </a>
        </nav>

        <a className="navCta" href="https://app.allscale.io" target="_blank">
          Launch App
        </a>
      </header>

      <section className="hero">
        <p className="eyebrow">Community feedback</p>
        <h1>Real feedback from AllScale users</h1>
        <p className="subtitle">
          A curated collection of public X/Twitter reviews from people using
          AllScale for stablecoin payments, global transfers, invoices, payroll,
          and borderless business.
        </p>

        <div className="heroActions">
          <a href="#submit" className="primaryButton">
            Add your feedback
          </a>
          <a href="#wall" className="secondaryButton">
            View feedback
          </a>
        </div>
      </section>

      <section id="submit" className="submitSection">
        <div>
          <p className="sectionLabel">Submit feedback</p>
          <h2>Add your tweet review</h2>
          <p>
            Paste a public X/Twitter post URL with your AllScale feedback. It
            will appear as an embedded tweet preview.
          </p>
        </div>

        <form onSubmit={addTweet} className="tweetForm">
          <input
            value={tweetUrl}
            onChange={(event) => setTweetUrl(event.target.value)}
            placeholder="https://x.com/username/status/..."
          />
          <button type="submit" disabled={saving}>
            <Plus size={16} />
            {saving ? "Adding..." : "Add tweet"}
          </button>
        </form>
      </section>

      <section id="wall" className="wallSection">
        <div className="sectionHeader">
          <div>
            <p className="sectionLabel">Feedback wall</p>
            <h2>AllScale feedback wall</h2>
          </div>
          <span>{tweets.length} tweets</span>
        </div>

        {loading ? (
          <p className="emptyState">Loading feedback...</p>
        ) : tweets.length === 0 ? (
          <p className="emptyState">No feedback tweets yet. Be the first one.</p>
        ) : (
          <div className="tweetGrid">
            {tweets.map((tweet) => (
              <article className="tweetCard" key={tweet.id}>
                <blockquote className="twitter-tweet" data-theme="light">
                  <a href={tweet.url}>{tweet.url}</a>
                </blockquote>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
