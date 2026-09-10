import CTA from "@/components/sections/cta";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import LogoCloud from "@/components/sections/logo-cloud";
import Pricing from "@/components/sections/pricing";
import Testimonials from "@/components/sections/testimonials";

export default function Page() {
  return (
    <>
      <main className="flex min-h-dvh flex-col overflow-hidden">
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
