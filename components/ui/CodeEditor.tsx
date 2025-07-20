'use client';


import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { io, Socket } from 'socket.io-client';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '@/constants/LanguageVersion';
import Output from './Output';
import { useParams } from 'next/navigation';  

type Language = keyof typeof CODE_SNIPPETS;

const CodeEditor = () => {
  const params = useParams();
  const roomId = params.id as string;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const socket = useRef<Socket | null>(null);
  const [language, setLanguage] = useState<Language>('javascript');
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [code, setCode] = useState<string>(CODE_SNIPPETS['javascript']);
  const preventEmit = useRef(false);

  const onMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };


  useEffect(() => {
    const s = io('http://localhost:3000');
    socket.current = s;

    s.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      s.emit('join-room', { roomId });
      setIsSocketConnected(true);
    });

    s.on('code-change', ({ code: newCode }) => {
      preventEmit.current = true;
      setCode(newCode);
    });

    s.on('language-change', ({ language: newLanguage }) => {
      console.log(`🌿 Client received language-change: ${newLanguage}`);
      const lang = newLanguage as Language;
      console.log(lang)
      if (!CODE_SNIPPETS[lang]) {
        console.error('⚠️ Invalid language received:', newLanguage);
        return;
      }
      setLanguage(newLanguage);
      setCode(CODE_SNIPPETS[lang]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setCode(value);

    if (preventEmit.current) {
      preventEmit.current = false;
      return;
    }

    socket.current?.emit('code-change', { code: value, roomId });
  };

  const onSelect = (selectedLanguage: Language) => {
    const snippet = CODE_SNIPPETS[selectedLanguage];
    setLanguage(selectedLanguage);
    setCode(snippet);
    if (!isSocketConnected) {
        console.log('Socket not connected yet, skipping emit.');
        return;
    }
    console.log("Emitting language-change with:", { language: selectedLanguage, roomId });
    socket.current?.emit('code-change', { code: snippet, roomId });
    socket.current?.emit('language-change', { language: selectedLanguage, roomId });
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
            language={language}
            value={code}
            onMount={onMount}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>

      {/* Right panel: Output */}
      <div className="flex flex-col w-full md:w-[400px] p-4 bg-neutral-950 border-t md:border-t-0 md:border-l border-gray-700 overflow-y-auto">
        <Output editorRef={editorRef}  />
      </div>
    </section>
  );
};

export default CodeEditor;