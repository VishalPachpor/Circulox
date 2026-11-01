import Image from "next/image";
import clients from "@/data/clients.json";
import styles from "./client-showcase.module.css";

export function ClientShowcase() {
  return (
    <section className={styles.section} aria-labelledby="clients-title">
      <div className="shell">
        <div className={styles.heading}>
          <h2 id="clients-title">Selected clients</h2>
        </div>
        <div className={styles.window}>
          <div
            className={styles.track}
            style={{ animationDuration: `${clients.length * 3}s` }}
          >
            <ul className={styles.group} aria-label="Circulox clients">
              {clients.map((client) => (
                <li key={client.url}>
                  <a href={client.url} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={client.width}
                      height={client.height}
                      loading="eager"
                      className={client.monochrome ? styles.monochrome : undefined}
                    />
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={`${styles.group} ${styles.duplicate}`} aria-hidden="true">
              {clients.map((client) => (
                <span className={styles.copy} key={client.url}>
                  <Image
                    src={client.logo}
                    alt=""
                    width={client.width}
                    height={client.height}
                    loading="eager"
                    className={client.monochrome ? styles.monochrome : undefined}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
