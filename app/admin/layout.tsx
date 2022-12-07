import 'server-only';

import NavBar from '~/shared/components/NavBar';

import QueryContextProvider from './context';

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <QueryContextProvider>
      <div className="flex h-full w-full items-center justify-center gap-3 px-3 pb-3 pt-11">
        <NavBar isAdmin />

        <div className="h-full w-full rounded-xl bg-gray-100 shadow-xl">
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </QueryContextProvider>
  );
}
