// Route-level metadata only; renders the page unchanged.
export const metadata = {
  title: "Track order",
  description: "Track a Surya Enterprises order with your order ID and mobile number.",
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
