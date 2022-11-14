'use client';
import 'client-only';
import React from 'react';

import { User } from '~/shared/types';

export const AuthContext = React.createContext<{
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({ setUser: () => ({}) });

export default function AuthProvider({
  children,
  user,
}: React.PropsWithChildren<{ user?: User }>) {
  const [currentUser, setCurrentUser] = React.useState<User | undefined>(user);

  return (
    <AuthContext.Provider
      value={{ user: currentUser, setUser: setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
