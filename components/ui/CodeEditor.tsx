'use client';

import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { io, Socket } from 'socket.io-client';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '@/constants/LanguageVersion';
import Output from './Output';

type Language = keyof typeof CODE_SNIPPETS;

let socket: Socket | null = null;

const CodeEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState<string>(CODE_SNIPPETS["javascript"]);
  const preventEmit = useRef(false);

  const onMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };

  useEffect(() => {
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
    });

    socket.on('code-change', ({ code: newCode }) => {
      preventEmit.current = true;
      setCode(newCode);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setCode(value);

    if (preventEmit.current) {
      preventEmit.current = false;
      return;
    }

    socket?.emit('code-change', { code: value });
  };

  const onSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage]);
    socket?.emit('code-change', { code: CODE_SNIPPETS[selectedLanguage] });
  };

  return (
    <section className="flex flex-col md:flex-row h-full w-full bg-neutral-900 text-white overflow-hidden">
      {/* Left panel: Editor and Language Selector */}
      <div className="flex flex-col flex-1 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Collaborative Code Editor</h2>
          <LanguageSelector language={language} onSelect={onSelect} />
        </div>

        <div className="flex-grow bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            language={language}
            value={code}
            onMount={onMount}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>
      </div>

      {/* Right panel: Output */}
      <div className="flex flex-col w-full md:w-[400px] p-4 bg-neutral-950 border-t md:border-t-0 md:border-l border-gray-700 overflow-y-auto">
        <Output editorRef={editorRef} language={language} />
      </div>
    </section>
  );
};

export default CodeEditor;
