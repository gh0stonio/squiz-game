'use client';
import 'client-only';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiOutlineUser } from 'react-icons/hi';
import React from 'react';

import useAuth from '~/shared/hooks/useAuth';
import { auth } from '~/shared/lib/firebase';

import Logo from '../../../public/logo.png';

export default function NavBar() {
  const { logIn, logOut } = useAuth();
  const pathName = usePathname();
  const isAdminPage = pathName?.startsWith('/quiz/admin');

  return (
    <div className="navbar my-10 w-[95%] rounded-xl bg-gray-100 px-4">
      <div className="navbar-start">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" height={40} priority />
          <p className="pl-4 text-2xl font-semibold">Squiz Game</p>
        </div>
      </div>

      <div className="navbar-end">
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full">
                {auth.currentUser?.photoURL ? (
                  <Image
                    src={auth.currentUser.photoURL!}
                    alt="user photo"
                    width={40}
                    height={40}
                    priority
                  />
                ) : (
                  <div className="flex h-[40px] w-[40px] items-center justify-center bg-gray-200">
                    <HiOutlineUser className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-gray-100 p-2 shadow"
            >
              {auth.currentUser ? (
                <li>
                  <button onClick={logOut}>Sign Out</button>
                </li>
              ) : (
                <li>
                  <button onClick={logIn}>Sign In</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
