import 'server-only';
import Image from 'next/image';
import React from 'react';

import Logo from '../../public/logo.png';

import LoginButton from './components/LoginButton';

export default function LoginPage() {
  return (
    <div className="h-full w-full py-16">
      <div className="container m-auto flex h-full items-center justify-center px-6 text-gray-500 md:px-12 xl:px-40">
        <div className="m-auto w-5/12">
          <div className="rounded-xl bg-gray-100 shadow-xl">
            <div className="px-14 pt-14 pb-8">
              <div className="space-y-4">
                <Image src={Logo} alt="logo" height={120} priority />
                <h2 className="mb-8 text-2xl font-bold text-cyan-900">
                  Sign in to join the fun !
                </h2>
              </div>

              <div className="my-20 grid space-y-4">
                <LoginButton />
              </div>

              <div className="text-center text-gray-600">
                <p className="text-xs">
                  By proceeding, you agree to our Terms of Use <br />
                </p>
                <p className="mt-0 text-xs font-bold">
                  (TL;DR Nils is always right)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
