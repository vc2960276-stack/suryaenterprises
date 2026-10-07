// Route-level metadata only; renders the page unchanged.
export const metadata = { title: "Checkout", robots: { index: false } };

export default function Layout({ children }) {
  return children;
}
