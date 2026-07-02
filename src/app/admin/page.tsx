import { isAuthenticatedFromCookies } from "@/lib/auth";
import { getMenuInfo } from "@/lib/menu";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginForm } from "@/components/LoginForm";

export default async function AdminPage() {
  const authenticated = await isAuthenticatedFromCookies();
  const menuInfo = authenticated ? await getMenuInfo() : null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4 py-10">
      {authenticated ? <AdminPanel menuInfo={menuInfo} /> : <LoginForm />}
    </main>
  );
}
