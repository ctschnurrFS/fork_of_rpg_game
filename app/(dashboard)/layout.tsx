'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crosshair, Home, LogOut, Star, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
        <img
              src="/images/Rogue_Terminal_Logo.svg"
              alt="My Company Logo"
              className="h-25 w-auto"
            />
          <span className="ml-2 text-xl font-semibold text-gray-900">RPG Game MVP</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/pricing"
            className="inline-block rounded-md bg-yellow-600 px-4 py-2 text-base font-semibold text-amber-50 shadow-md transition duration-150 ease-in-out hover:bg-yellow-700 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2" // Example Tailwind styling
          >
            Check out our Game Store!
          </Link>

          {user ? (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger>
                <Menu className="mr-2 h-6 w-6 cursor-pointer p-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1">

                {/* Show if role is 'admin' OR 'owner' */}
                {(user?.role === 'admin' || user?.role === 'owner') && (
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard" className="flex w-full items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* === CONDITIONAL LINK START === */}
                {/* Check if user exists (already true here), has a role, and role is 'regular' */}
                {/* Using optional chaining (?.) is safest */}
                {(user?.role === 'regular' || user?.role === 'member') && (
                  <DropdownMenuItem className="cursor-pointer p-0">
                    {/* Replace href and text with your actual link/feature */}
                    <Link href="/myuseraccount" className="flex w-full items-center px-2 py-1.5">
                      {/* Replace with a relevant icon */}
                      <Star className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* === CONDITIONAL LINK END === */}


                <form action={handleSignOut} className="w-full">
                  <button type="submit" className="flex w-full">
                    <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
