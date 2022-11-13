'use client';
import 'client-only';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { auth } from '~/shared/lib/firebase';

export default function useAuth() {
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const referer = params.get('referer');

  const logIn = React.useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: 'user@datadoghq.com',
    });

    const result = await signInWithPopup(auth, provider);
    let _error = undefined;

    if (!result.user.emailVerified) _error = 'Not verified';
    if (!result.user.email?.endsWith('datadoghq.com')) _error = 'Not a pup';
    if (_error) {
      setError('Not a pup');
      return auth.signOut();
    }

    router.push(referer || '/');
  }, [referer, router]);

  const logOut = React.useCallback(async () => {
    await auth.signOut();

    router.push(`/login?referer=${pathName}`);
  }, [router, pathName]);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && pathName?.startsWith('/login')) {
        router.push(referer || '/');
      }

      setTimeout(() => setIsLoading(false), 1000);
    });

    return unsubscribe;
  }, [pathName, referer, router]);

  const user = React.useMemo(() => auth.currentUser, []);

  return {
    user,
    isLoading,
    error,
    logIn,
    logOut,
  };
}
