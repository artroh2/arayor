import { Header } from "./Header";
import { Footer } from "./Footer";
import { CompareBar } from "@/components/compare/CompareBar";
import { MarketTicker } from "@/components/ticker/MarketTicker";
import { AISentinel } from "@/components/sentinel/AISentinel";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />
      <main className="flex-1 pb-24">{children}</main>
      <Footer />
      <CompareBar />
      <AISentinel />
    </div>
  );
}
