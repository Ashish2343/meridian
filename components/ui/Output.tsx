"use client";

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { executeCode } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // adjust to your Button location 
import {io, Socket} from 'socket.io-client'
import { getSocket } from '@/lib/socket';
import { tr } from 'date-fns/locale';



type OutputProps = {
  editorRef: React.MutableRefObject<any>;
  language: string;
};

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  useEffect(()=>{
    const socket = getSocket();
    socketRef.current = socket;
    
    socket.on("run-code", async ({ sourceCode, language }) => {
      setIsLoading(true);
      setIsError(false);
      setOutput([]);

      try {
        const { run } = await executeCode(language as any, sourceCode);
        const lines = run.output ? run.output.split("\n") : [];
        setOutput(lines);
        setIsError(run.stderr ? true : false);
        toast.success("Code executed successfully");
      } catch (error: any) {
        console.error(error);
        setIsError(true);
        toast.error(error.message || "Error executing code");
      } finally {
        setIsLoading(false);
      }
    });
  },[])


  const handleRunCode = () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) {
      toast.error("No code to execute");
      return;
    }
    socketRef.current?.emit("run-code", { sourceCode, language });
  };

  return (
  <section className='w-[100%] h-full flex flex-col gap-2'>
    <div className="flex items-center gap-2">
      <label className="font-medium">Output</label>
      <Button onClick={handleRunCode} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Code"}
      </Button>
    </div>
    <div className={`flex-1 p-2 rounded bg-black text-white text-sm overflow-y-auto ${isError ? 'border border-red-500' : 'border border-green-500'}`}>
      {output.length > 0
        ? output.map((line, i) => <p key={i}>{line}</p>)
        : <p className="text-gray-400">Click "Run" to see the output here.</p>}
    </div>
  </section>
);

};

export default Output;
