import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import landingImage from "@assets/image_1766928192688.png";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-8 pt-24 sm:py-12 sm:pt-12 md:py-16">
        <div className="w-full max-w-4xl text-center">
          <div 
            className="flex flex-col items-center gap-1 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl"
            data-testid="text-greeting"
          >
            <span>வணக்கம்</span>
            <span>నమస్తే</span>
            <span>Hello</span>
          </div>
          <h2 
            className="mt-3 text-xl font-semibold text-white drop-shadow-lg sm:mt-4 sm:text-2xl md:text-3xl lg:text-4xl"
            data-testid="text-community"
          >
            Desuru Reddy's Community
          </h2>
        </div>
        
        <div className="flex-1" />
        
        <div className="pb-8 sm:pb-12 md:pb-16">
          <Button
            size="lg"
            onClick={() => setLocation("/form")}
            className="gap-2 border-2 border-amber-300/60 bg-amber-600/80 px-8 text-lg font-semibold text-white shadow-lg backdrop-blur-sm hover:bg-amber-600 sm:text-xl"
            data-testid="button-proceed"
          >
            Proceed
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
