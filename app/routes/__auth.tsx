import { Outlet } from 'remix';
import SiteLayout from '~/components/SiteLayout';

export default function AuthLayout() {
  return (
    <SiteLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <main className="w-full sm:w-3/4 md:w-8/12 lg:w-6/12 xl:w-4/12">
          <Outlet />
        </main>
        <aside className="mt-4 text-center">{/* Anything? */}</aside>
      </div>
    </SiteLayout>
  );
}
