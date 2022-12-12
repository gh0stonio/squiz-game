'use client';
import 'client-only';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiUserGroup, HiHome, HiOutlineUser } from 'react-icons/hi';
import React from 'react';

import useAuth from '~/shared/hooks/useAuth';

import Logo from '../../../public/logo.png';

interface NavBarProps {
  isAdmin?: boolean;
}
export default function NavBar({ isAdmin }: NavBarProps) {
  const { user, logIn, logOut } = useAuth();

  const pathName = usePathname();
  const shouldDisplayCenterNav =
    pathName?.includes('lobby') || pathName?.includes('teams');

  return (
    <div className="navbar flex h-full w-[5%] max-w-min flex-col items-center justify-between rounded-xl bg-gray-100">
      <div className="navbar-start flex w-full items-center justify-center pt-2">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" height={40} priority />
        </div>
      </div>

      {shouldDisplayCenterNav && (
        <ul className="menu rounded-box bg-gray-600">
          <li>
            <Link
              href={pathName?.replace('teams', 'lobby') as string}
              className={clsx('tooltip tooltip-right', {
                active: pathName?.includes('lobby'),
              })}
              data-tip="Lobby"
            >
              <HiHome className="h-5 w-5 text-white" />
            </Link>
          </li>
          <li>
            <Link
              href={pathName?.replace('lobby', 'teams') as string}
              className={clsx('tooltip tooltip-right', {
                active: pathName?.includes('teams'),
              })}
              data-tip="Teams"
            >
              <HiUserGroup className="h-5 w-5 text-white" />
            </Link>
          </li>
        </ul>
      )}

      <div className="navbar-end flex w-full items-center justify-center">
        <div className="flex-none">
          <div className="dropdown-top dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL!}
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
              {user ? (
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
