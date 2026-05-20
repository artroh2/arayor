import toyotaLogo from "@/assets/brands/toyota.svg";
import hondaLogo from "@/assets/brands/honda.svg";
import bmwLogo from "@/assets/brands/bmw.svg";
import mercedesLogo from "@/assets/brands/mercedes.svg";
import volkswagenLogo from "@/assets/brands/volkswagen.svg";
import audiLogo from "@/assets/brands/audi.svg";
import fordLogo from "@/assets/brands/ford.svg";
import hyundaiLogo from "@/assets/brands/hyundai.svg";
import renaultLogo from "@/assets/brands/renault.svg";
import porscheLogo from "@/assets/brands/porsche.svg";
import volvoLogo from "@/assets/brands/volvo.svg";
import teslaLogo from "@/assets/brands/tesla.svg";
import chevroletLogo from "@/assets/brands/chevrolet.svg";
import mazdaLogo from "@/assets/brands/mazda.svg";
import kiaLogo from "@/assets/brands/kia.svg";
import nissanLogo from "@/assets/brands/nissan.svg";
import peugeotLogo from "@/assets/brands/peugeot.svg";
import alfaRomeoLogo from "@/assets/brands/alfa-romeo.svg";
import ferrariLogo from "@/assets/brands/ferrari.svg";
import toggLogo from "@/assets/brands/togg.jpg";
import daciaLogo from "@/assets/brands/dacia.png";
import skodaLogo from "@/assets/brands/skoda.png";
import citroenLogo from "@/assets/brands/citroen.png";
import bydLogo from "@/assets/brands/byd.jpeg";
import opelLogo from "@/assets/brands/opel.jpg";
import cheryLogo from "@/assets/brands/chery.webp";

const brandLogos: Record<string, string> = {
  "1": toyotaLogo,
  "2": hondaLogo,
  "3": bmwLogo,
  "4": mercedesLogo,
  "5": volkswagenLogo,
  "6": audiLogo,
  "7": fordLogo,
  "8": hyundaiLogo,
  "9": renaultLogo,
  "10": porscheLogo,
  "11": volvoLogo,
  "12": teslaLogo,
  "13": chevroletLogo,
  "14": mazdaLogo,
  "15": kiaLogo,
  "16": nissanLogo,
  "17": peugeotLogo,
  "18": toggLogo,
  "19": daciaLogo,
  "20": skodaLogo,
  "21": citroenLogo,
  "22": bydLogo,
  "23": alfaRomeoLogo,
  "24": opelLogo,
  "25": ferrariLogo,
  "26": cheryLogo,
};

interface BrandLogoProps {
  brandId: string;
  className?: string;
  brandName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandId, className = "h-8 w-auto", brandName }) => {
  const logoSrc = brandLogos[brandId];
  
  if (logoSrc) {
    return <img src={logoSrc} alt={brandName || "Brand logo"} className={className} />;
  }
  
  // Final fallback - just show brand name
  return (
    <div className={`flex items-center justify-center font-bold text-xs tracking-wide text-foreground ${className}`}>
      {brandName || brandId}
    </div>
  );
};
