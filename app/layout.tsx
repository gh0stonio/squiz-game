import 'react-toastify/dist/ReactToastify.css';
import 'server-only';

import '~/shared/styles/globals.css';

import React from 'react';

import ToastContainer from '~/shared/components/ToastContainer';
import AuthProvider from '~/shared/context/AuthContext';
import { getUser } from '~/shared/data/getUser';

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getUser();

  return (
    <html lang="en">
      <head />
      <body>
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-black antialiased">
          <AuthProvider user={user}>{children}</AuthProvider>
        </div>

        <ToastContainer />
      </body>
    </html>
  );
}
