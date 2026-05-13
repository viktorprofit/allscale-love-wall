"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

const DEFAULT_TWEETS = [
  "https://twitter.com/allscale_io/status/1900000000000000000",
  "https://twitter.com/allscale_io/status/1900000000000000001",
  "https://twitter.com/allscale_io/status/1900000000000000002",
  "https://twitter.com/allscale_io/status/1900000000000000003"
];

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

  const isTweet =
    clean.includes("twitter.com/") ||
    clean.includes("x.com/");

  if (!isTweet || !clean.includes("/status/")) return null;

  return clean.replace("x.com", "twitter.com");
}

export default function Page() {
  const [tweetUrl, setTweetUrl] = useState("");
  const [tweets, setTweets] = useState<string[]>(DEFAULT_TWEETS);

  useEffect(() => {
    const saved = localStorage.getItem("allscale-tweets");

    if (saved) {
      setTweets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("allscale-tweets", JSON.stringify(tweets));

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

  function addTweet(event: React.FormEvent) {
    event.preventDefault();

    const normalized = normalizeTweetUrl(tweetUrl);

    if (!normalized) {
      alert("Paste a valid X/Twitter post link.");
      return;
    }

    if (tweets.includes(normalized)) {
      alert("This tweet is already added.");
      return;
    }

    setTweets([normalized, ...tweets]);
    setTweetUrl("");
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
          <a href="#wall">Wall</a>
          <a href="#submit">Submit tweet</a>
          <a href="https://www.allscale.io" target="_blank">
            AllScale <ArrowUpRight size={16} />
          </a>
        </nav>

        <a className="navCta" href="https://app.allscale.io" target="_blank">
          Launch App
        </a>
      </header>

      <section className="hero">
        <p className="eyebrow">Community testimonials</p>
        <h1>What people say about AllScale</h1>
        <p className="subtitle">
          A curated wall of real user tweets about self-custody stablecoin
          banking, global payments, payroll, invoices, and borderless business.
        </p>

        <div className="heroActions">
          <a href="#submit" className="primaryButton">
            Add your tweet
          </a>
          <a href="#wall" className="secondaryButton">
            View wall
          </a>
        </div>
      </section>

      <section id="submit" className="submitSection">
        <div>
          <p className="sectionLabel">Submit</p>
          <h2>Add your tweet to the wall</h2>
          <p>
            Paste a public X/Twitter post URL. It will appear as an embedded
            tweet preview.
          </p>
        </div>

        <form onSubmit={addTweet} className="tweetForm">
          <input
            value={tweetUrl}
            onChange={(event) => setTweetUrl(event.target.value)}
            placeholder="https://x.com/username/status/..."
          />
          <button type="submit">
            <Plus size={20} />
            Add tweet
          </button>
        </form>
      </section>

      <section id="wall" className="wallSection">
        <div className="sectionHeader">
          <div>
            <p className="sectionLabel">Wall</p>
            <h2>AllScale love wall</h2>
          </div>
          <span>{tweets.length} tweets</span>
        </div>

        <div className="tweetGrid">
          {tweets.map((url) => (
            <article className="tweetCard" key={url}>
              <blockquote className="twitter-tweet" data-theme="light">
                <a href={url}>{url}</a>
              </blockquote>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
