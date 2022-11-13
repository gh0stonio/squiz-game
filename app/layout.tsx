import 'server-only';

import '~/shared/styles/globals.css';

import React from 'react';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-black antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}
