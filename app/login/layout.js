// Route-level metadata only; renders the page unchanged.
export const metadata = { title: "Sign in", robots: { index: false, follow: true } };

export default function Layout({ children }) {
  return children;
}
