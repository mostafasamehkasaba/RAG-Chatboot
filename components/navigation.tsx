"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function Navigation() {
  return (
    <header className="h-16 border-b bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
            R
          </div>

          <span className="text-[17px] font-semibold tracking-tight text-gray-900">
            RAG Chatbot
          </span>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-2">
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="
                  h-9 rounded-lg px-4
                  text-sm font-medium text-gray-700
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900
                "
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                className="
                  h-9 rounded-lg
                  bg-gray-900 px-4
                  text-sm font-medium text-white
                  shadow-sm
                  transition
                  hover:bg-gray-800
                  active:scale-[0.98]
                "
              >
                Get started
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <SignOutButton>
                <button
                  className="
                    hidden h-9 rounded-lg
                    border border-gray-200
                    bg-white px-4
                    text-sm font-medium text-gray-700
                    transition
                    hover:bg-gray-50
                    sm:block
                  "
                >
                  Sign out
                </button>
              </SignOutButton>

              <UserButton />
            </div>
          </Show>

        </div>
      </div>
    </header>
  );
}