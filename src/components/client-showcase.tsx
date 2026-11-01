"use client";

import { useState } from "react";
import clients from "@/data/clients.json";
import styles from "./client-showcase.module.css";

export function ClientShowcase() {
  const [paused, setPaused] = useState(false);
  return (
    <section className={styles.section} aria-labelledby="clients-title">
      <div className="shell">
        <div className={styles.heading}>
          <h2 id="clients-title">Selected clients</h2>
          <button
            type="button"
            className={styles.pause}
            aria-pressed={paused}
            aria-label={paused ? "Resume client scrolling" : "Pause client scrolling"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
        <div className={styles.window}>
          <div
            className={styles.track}
            data-paused={paused}
            style={{ animationDuration: `${(clients.length * 42) / 9}s` }}
          >
            <ul className={styles.group} aria-label="Circulox clients">
              {clients.map((client) => (
                <li key={client.url}>
                  <a href={client.url} target="_blank" rel="noopener noreferrer">
                    {client.name}
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={`${styles.group} ${styles.duplicate}`} aria-hidden="true">
              {clients.map((client) => (
                <span className={styles.copy} key={client.url}>{client.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
