import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database } from 'lucide-react';
import { Terminal } from './terminal';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main>
      <img
        src="/images/Rogue_Terminal_Logo.svg"
        alt="My Company Logo"
        className="h-50 w-auto m-auto"
      />
      <section className="py-5">
        <div className="max-w-7xl h-auto mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" lg:gap-8 h-full">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-center text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                {/* RPG Game MVP */}
                {/* <span className="block text-orange-500">In Development</span> */}
              </h1>
              {/* <p className="text-center mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                We're in the exploratory phase.
              </p> */}
            </div>
            {/* <div className="mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"> */}
            <div className="h-120">
              <Terminal player={user} />
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections (commented out in your code) */}
    </main>
  );
}
