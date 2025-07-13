import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { LANGUAGE_VERSIONS } from "@/constants/LanguageVersion";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Use dynamic type safety
type Language = keyof typeof LANGUAGE_VERSIONS;

// Optional: Strongly typed response
interface ExecuteCodeResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
}

export const executeCode = async (
  language: Language,
  sourceCode: string
): Promise<ExecuteCodeResponse> => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      { content: sourceCode }
    ],
  });
  return response.data;
};
