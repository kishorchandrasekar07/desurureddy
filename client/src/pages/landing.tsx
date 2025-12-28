import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import landingImage from "@assets/image_1766928192688.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-4xl text-center">
          <h1 
            className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl"
            data-testid="text-greeting"
          >
            வணக்கம் | నమస్తే | Hello
          </h1>
          <h2 
            className="mt-2 text-xl font-semibold text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl"
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
            className="min-w-[160px] bg-white/90 text-lg font-semibold text-gray-900 backdrop-blur-sm hover:bg-white sm:min-w-[200px] sm:text-xl"
            data-testid="button-proceed"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
