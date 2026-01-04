import { useLanguage, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md border">
      <span className="text-xs text-muted-foreground">
        Language / భాష / மொழி
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            data-testid="button-language-switcher"
          >
            <Languages className="w-4 h-4" />
            <span>{currentLang?.native}</span>
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
            data-testid={`menu-language-${lang.code}`}
          >
            <span className="font-medium">{lang.native}</span>
            <span className="ml-2 text-muted-foreground text-sm">({lang.label})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
