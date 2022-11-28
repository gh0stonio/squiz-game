import 'server-only';

import NavBar from '~/shared/components/NavBar';

import QueryContextProvider from './context';

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <QueryContextProvider>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NavBar isAdmin />

        <div className="m-auto mb-10 h-5/6 w-[95%] rounded-xl bg-gray-100 shadow-xl">
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </QueryContextProvider>
  );
}
