'use client';
import 'client-only';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineUser } from 'react-icons/hi';
import React from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useAuth from '~/shared/hooks/useAuth';

import Logo from '../../../public/logo.png';

interface NavBarProps {
  isAdmin?: boolean;
}
export default function NavBar({ isAdmin }: NavBarProps) {
  const { user, logIn, logOut } = useAuth();
  const { quiz } = useQuiz();
  const pathName = usePathname();

  const adminQuizPath = React.useMemo(() => {
    const parts = pathName?.split('/') || [];
    parts.pop();

    return parts.join('/');
  }, [pathName]);

  return (
    <div className="navbar my-10 w-[95%] rounded-xl bg-gray-100 px-4">
      <div className="navbar-start">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" height={40} priority />
          <p className="pl-4 text-2xl font-semibold">
            Squiz Game {isAdmin && ' - Admin'}
          </p>
        </div>
      </div>

      <div className="navbar-center lg:flex">
        <div className="btn-group">
          <Link
            className={clsx('btn no-animation', {
              'btn-active': pathName?.includes('lobby'),
            })}
            href={isAdmin ? `${adminQuizPath}/lobby` : `/quiz/${quiz.id}/lobby`}
          >
            Lobby
          </Link>
          <Link
            className={clsx('btn no-animation', {
              'btn-active': pathName?.includes('teams'),
            })}
            href={isAdmin ? `${adminQuizPath}/teams` : `/quiz/${quiz.id}/teams`}
          >
            Teams
          </Link>
        </div>
      </div>

      <div className="navbar-end">
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
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
