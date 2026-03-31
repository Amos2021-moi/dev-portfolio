import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DonationSection from "@/components/sections/DonationSection";
import MpesaDonation from "@/components/sections/MpesaDonation";

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="text-center py-16 px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Support My Work
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every contribution helps me keep building open source projects,
            writing tutorials, and sharing knowledge with the community.
            Choose your preferred payment method below.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="container-max px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto mb-4">
            <div
              className="p-4 rounded-xl border text-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="font-semibold">💳 International</p>
              <p className="text-sm text-muted-foreground">
                Card payments via Stripe
              </p>
            </div>
            <div
              className="p-4 rounded-xl border text-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="font-semibold">📱 Kenya Only</p>
              <p className="text-sm text-muted-foreground">
                M-Pesa Lipa Na M-Pesa
              </p>
            </div>
          </div>
        </div>

        <DonationSection />
        <MpesaDonation />
      </div>
      <Footer />
    </main>
  );
}