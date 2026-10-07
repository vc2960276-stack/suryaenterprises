"use client";

import { TriangleAlert } from "lucide-react";
import BrandLogo from "../components/shop/BrandLogo";
import styles from "./admin.module.css";

export default function AdminError({ reset }) {
  return <main className={styles.sessionLoading}><BrandLogo width={206} href={null} /><TriangleAlert size={26} /><h1 className={styles.errorHeading}>The workspace couldn’t open</h1><p>Please try loading your records again.</p><button className={styles.primaryButton} onClick={reset}>Try again</button></main>;
}
