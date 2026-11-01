import Image from "next/image";
import styles from "./brand-logo.module.css";

export function BrandLogo() {
  return (
    <span className={styles.lockup}>
      <Image src="/brand/circulox-theme.webp" alt="" width={40} height={40} priority />
      <span>Circulox</span>
    </span>
  );
}
