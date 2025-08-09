import StreamVideoProvider from '@/provider/StreamClientProvider'
import { Metadata } from 'next';
import React, { Children, ReactNode } from 'react'


export const metadata: Metadata = {
  title: "meridian",
  description: "video calling",
  icons:{
    icon: '/icons/logo.svg'
  }
};

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <main>
        <StreamVideoProvider>
          {children}
          <div id="editor-root"></div>
        </StreamVideoProvider>
    </main>
  )
}

export default RootLayout