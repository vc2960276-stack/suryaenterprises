// Route-level metadata only; renders the page unchanged.
export const metadata = { title: "My account", robots: { index: false, follow: false } };

export default function Layout({ children }) {
  return children;
}
