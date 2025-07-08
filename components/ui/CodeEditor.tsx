'use client';

import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useCall } from '@stream-io/video-react-sdk';

const CodeEditor = () => {
  const call = useCall();
  const [code, setCode] = useState<string | null>(null);

  return (
    <section className="h-[700px] w-full">
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={code ?? "// Start typing here..."}
        onChange={async (value) => {
          if (value === undefined) return;
          setCode(value);
        }}
      />
    </section>
  );
};

export default CodeEditor;
