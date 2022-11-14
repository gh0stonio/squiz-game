import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { auth } from '~/shared/lib/firebaseAdmin';
import { User } from '~/shared/types';

const getUserCredentialsFromToken = cache(async (idToken: string) => {
  const decodedToken = await auth.verifyIdToken(idToken);

  if (decodedToken) {
    const user: User = {
      uid: decodedToken.uid,
      name: decodedToken.name,
      email: decodedToken.email!,
      emailVerified: decodedToken.email_verified,
      photoURL: decodedToken.picture,
    };

    return user;
  }
});

export function getUser() {
  const nextCookies = cookies();
  const idToken = nextCookies.get('id_token')?.value;

  if (!idToken) return;

  return getUserCredentialsFromToken(idToken);
}
