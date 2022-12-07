'use client';
import 'client-only';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { type User as FirebaseUser } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'nookies';
import React from 'react';

import { auth } from '~/shared/lib/firebaseClient';

import { AuthContext } from '../context/AuthContext';

async function setTokenCookie(user: FirebaseUser) {
  const idToken = await user.getIdToken(true);
  setCookie(null, 'id_token', idToken, {
    maxAge: 60 * 60, // 1 hour
    path: '/',
    sameSite: 'None',
    secure: true,
  });
}
function clearTokenCookie() {
  setCookie(null, 'id_token', '', {
    maxAge: 0,
    path: '/',
    sameSite: 'None',
    secure: true,
  });
}

export default function useAuth() {
  const { user, setUser } = React.useContext(AuthContext);
  const [error, setError] = React.useState<string>();

  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const referer = params.get('referer');

  React.useEffect(() => {
    if (user && referer) {
      router.push(referer);
    }
  }, [referer, router, user]);

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

    await setTokenCookie(result.user);

    if (referer) {
      router.push(referer || '/');
    } else {
      setTimeout(() => router.refresh(), 1000);
    }
  }, [referer, router]);

  const logOut = React.useCallback(async () => {
    await auth.signOut();
    clearTokenCookie();

    router.push(`/login?referer=${pathName}`);
  }, [router, pathName]);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(undefined);
        clearTokenCookie();

        return;
      }

      await setTokenCookie(firebaseUser);

      if (!user) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email!,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
        });
      }
    });

    return unsubscribe;
  }, [pathName, referer, router, setUser, user]);

  return {
    user,
    error,
    logIn,
    logOut,
  };
}
