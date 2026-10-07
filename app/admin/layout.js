import styles from "./admin.module.css";

export const metadata = {
  title: "Owner operations",
  description: "Private Surya Enterprises owner workspace.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }) {
  return <div className={styles.root}>{children}</div>;
}
