import type { MetaFunction } from 'remix';
import SiteLayout from '~/components/SiteLayout';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Welcome',
    description: 'Welcome to Remix Starter Kit',
  };
};

export default function Welcome() {
  return (
    <SiteLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <main className="">
          <p>
            You're signed-up now. Please check your email for the activation
            email
          </p>
        </main>
        <aside className="mt-4 text-center">{/* Anything? */}</aside>
      </div>
    </SiteLayout>
  );
}
