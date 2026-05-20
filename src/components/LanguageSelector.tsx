import { Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { language, setLanguage, currentLanguage } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full"
          title={currentLanguage.nativeName}
        >
          <span className="text-base">{currentLanguage.flag}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-2 max-h-80 overflow-y-auto" 
        align="end"
        sideOffset={8}
      >
        <div className="grid gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left",
                language === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{lang.nativeName}</p>
                <p className={cn(
                  "text-xs truncate",
                  language === lang.code 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {lang.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
