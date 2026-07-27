"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import PartnerHeader from "@/components/partner/PartnerHeader";
import PartnerSidebar from "@/components/partner/PartnerSidebar";

type PartnerLayoutProps = {
  children: ReactNode;
};
const DASHBOARD_SECTIONS = new Set([
  "dashboard",
  "profile",
  "quotes",
  "calendar",
  "settings",
]);

const PROTECTED_SECTIONS = new Set([
  "dashboard",
  "profile",
  "quotes",
  "calendar",
  "settings",
  "onboarding",
]);

export default function PartnerLayout({
  children,
}: PartnerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const section = pathParts[1];

  const usesDashboardLayout =
    pathname === "/partner" ||
    DASHBOARD_SECTIONS.has(section);
const requiresPartnerAccess =
  pathname === "/partner" ||
  PROTECTED_SECTIONS.has(section);

  useEffect(() => {
  if (!requiresPartnerAccess) {
    setCheckingSession(false);
    setAuthorized(false);
    return;
  }

  let active = true;

  function redirectToLogin() {
    if (!active) {
      return;
    }

    setAuthorized(false);
    setCheckingSession(false);

    const nextPath =
      encodeURIComponent(pathname);

    router.replace(
      `/partner/login?next=${nextPath}`,
    );
  }

  async function authorizeUser(
    userId: string,
  ) {
    try {
      const partnerExists =
        await hasPartnerProfile(userId);

      if (!active) {
        return;
      }

      if (!partnerExists) {
        redirectToLogin();
        return;
      }

      setAuthorized(true);
      setCheckingSession(false);
    } catch (authorizationError) {
      console.error(
        "PARTNER AUTHORIZATION ERROR:",
        authorizationError,
      );

      redirectToLogin();
    }
  }

  async function checkSession() {
    const {
      data,
      error,
    } =
      await supabase.auth.getSession();

    if (!active) {
      return;
    }

    if (error || !data.session) {
      redirectToLogin();
      return;
    }

    await authorizeUser(
      data.session.user.id,
    );
  }

  setCheckingSession(true);
  setAuthorized(false);

  void checkSession();

  const {
    data: authListener,
  } =
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (
          !active ||
          !requiresPartnerAccess
        ) {
          return;
        }

        if (!session) {
          redirectToLogin();
          return;
        }

        setCheckingSession(true);
        setAuthorized(false);

        void authorizeUser(
          session.user.id,
        );
      },
    );

  return () => {
    active = false;
    authListener.subscription.unsubscribe();
  };
}, [
  pathname,
  requiresPartnerAccess,
  router,
]);

  if (!requiresPartnerAccess) {
  return children;
}

if (
  checkingSession ||
  !authorized
) {
  return <PartnerSessionLoading />;
}

if (!usesDashboardLayout) {
  return children;
}

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <PartnerSidebar />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-[#f2dfe3]/45 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-[45rem] h-72 w-72 rounded-full bg-[#f4dfbd]/35 blur-3xl"
          />

          <PartnerHeader />

          <main
            id="partner-main-content"
            className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
async function hasPartnerProfile(
  userId: string,
): Promise<boolean> {
  const {
    data,
    error,
  } = await supabase
    .from("partners")
    .select("id")
    .eq("auth_user_id", userId)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(
    data && data.length > 0,
  );
}
function PartnerSessionLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf8f2] px-5 text-[#211b16]">
      <div
        role="status"
        className="rounded-3xl border border-[#e8ded0] bg-white px-10 py-9 text-center shadow-sm"
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
        />

        <p className="mt-4 font-bold">
          Tarkistetaan kirjautuminen...
        </p>

        <p className="mt-1 text-sm text-[#70675e]">
          Sinut ohjataan tarvittaessa
          kirjautumissivulle.
        </p>
      </div>
    </main>
  );
}