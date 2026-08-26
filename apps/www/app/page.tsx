import { Geist } from "next/font/google";
import { Hero } from "../components/hero";
import { ComponentShowcase } from "../components/home/component-showcase";
import { DeveloperCli } from "../components/home/developer-cli";
import { FeatureGrid } from "../components/home/feature-grid";
import { GetStarted } from "../components/home/get-started";
import { LiveTheming } from "../components/home/live-theming";
import { LooksStage } from "../components/home/looks-stage";
import { SignalStats } from "../components/home/signal-stats";
import { SiteFooter } from "../components/home/site-footer";
import { SponsorBand } from "../components/home/sponsor-band";
import { SiteNav } from "../components/site-nav";

/** Geometric grotesk — closest OFL stand-in for x.ai's Universal Sans Display. */
const display = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <main id="main-content">
        <Hero displayClassName={display.className} />
        <DeveloperCli displayClassName={display.className} />
        <SignalStats displayClassName={display.className} />
        <LiveTheming />
        <LooksStage />
        <FeatureGrid />
        <ComponentShowcase />
        <GetStarted />
        <SponsorBand />
      </main>
      <SiteFooter />
    </div>
  );
}
