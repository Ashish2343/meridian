import React from 'react';
import { LANGUAGE_VERSIONS } from '@/constants/LanguageVersion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from 'clsx';    
type Language = keyof typeof LANGUAGE_VERSIONS;
const languages = Object.entries(LANGUAGE_VERSIONS);    

const LanguageSelector = ({
  language,
  onSelect,
}: { language: Language, onSelect: (lang: Language) => void}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Language:{ language}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map(([lang, version]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onSelect(lang as Language)}
            className={clsx(
              "flex justify-between",
              lang === language && "bg-blue-100 text-blue-600"
            )}
          >
            <span>{lang}</span>
            <span className="text-gray-500 text-sm">({version})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
