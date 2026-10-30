"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="setup-page">
      <h1>This page could not be loaded.</h1>
      <p>Please try again. Your saved content has not been changed.</p>
      <button onClick={reset}>Try again</button>{" "}
      <a href="/">Return to Circulox</a>
    </main>
  );
}
