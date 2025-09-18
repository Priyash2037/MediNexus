import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Language {
  code: 'en' | 'hi' | 'pa';
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'pa'>('en');

  return (
    <div className="flex items-center gap-1 bg-card/60 backdrop-blur-sm border border-border rounded-lg p-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentLanguage(lang.code)}
          className={`text-sm font-medium transition-all duration-200 ${
            currentLanguage === lang.code 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          {lang.nativeName}
        </Button>
      ))}
    </div>
  );
}