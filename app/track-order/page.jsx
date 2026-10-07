import PageHeader from "../components/shop/PageHeader";
import TrackOrderForm from "../components/shop/TrackOrderForm";

export default function TrackOrderPage() {
  return (
    <main className="pb-3">
      <PageHeader
        eyebrow="Customer service"
        title="Track your order"
        subtitle="Orders are currently tracked through our support team. Enter your order details and we'll put you in touch with the right person."
        crumbs={[{ label: "Track order" }]}
      />
      <div className="shell pt-3">
        <TrackOrderForm />
      </div>
    </main>
  );
}
