'use client';
import 'client-only';
import { FcGoogle } from 'react-icons/fc';
import { ThreeDots } from 'react-loader-spinner';
import React from 'react';

import useAuth from '~/shared/hooks/useAuth';

export default function LoginButton() {
  const { isLoading, error, logIn } = useAuth();

  return (
    <>
      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="rgb(236 72 153)"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <button
          onClick={logIn}
          className="loading group h-12 rounded-full border-2 border-gray-300 px-6 
transition duration-300 hover:border-pink-500"
        >
          <div className="relative flex items-center justify-center space-x-4">
            <FcGoogle className="absolute left-0 h-6 w-6" />
            <span className="block w-max text-sm font-semibold tracking-wide text-gray-700 transition duration-300 group-hover:text-pink-600 sm:text-base">
              Continue with Google
            </span>
          </div>
        </button>
      )}

      {error && (
        <p className=" text-red-600">
          {error === 'Not a pup'
            ? 'Sorry but only Datadog pups can join, retry with the proper Gmail account.'
            : 'Sorry something wrong happened during auth, please retry.'}
        </p>
      )}
    </>
  );
}
