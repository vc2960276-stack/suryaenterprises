import { LoaderCircle } from "lucide-react";
import BrandLogo from "../components/shop/BrandLogo";
import styles from "./admin.module.css";

export default function AdminLoading() {
  return <main className={styles.sessionLoading}><BrandLogo width={206} href={null} /><span className={styles.loadingLabel}><LoaderCircle size={17} className={styles.spin} />Opening your workspace…</span></main>;
}
