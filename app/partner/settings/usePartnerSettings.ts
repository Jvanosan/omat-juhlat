"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase";

type PartnerAccount = {
  id: string;
  company: string;
  email: string;
  slug: string | null;
  status: string | null;
  profile_completed: boolean | null;
};

export function usePartnerSettings() {
  const router = useRouter();

  const [
    account,
    setAccount,
  ] =
    useState<PartnerAccount | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    updatingPassword,
    setUpdatingPassword,
  ] = useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadAccount =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { session },
          error: sessionError,
        } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          router.replace(
            "/partner/login?next=/partner/settings",
          );

          return;
        }

        const {
          data: partner,
          error: partnerError,
        } = await supabase
          .from("partners")
          .select(`
            id,
            company,
            email,
            slug,
            status,
            profile_completed
          `)
          .eq(
            "auth_user_id",
            session.user.id,
          )
          .maybeSingle();

        if (partnerError) {
          throw partnerError;
        }

        if (!partner) {
          throw new Error(
            "Partneriprofiilia ei löytynyt.",
          );
        }

        setAccount({
          id: String(partner.id),

          company:
            partner.company ||
            "Partneriyritys",

          email:
            session.user.email ||
            partner.email ||
            "",

          slug:
            partner.slug ?? null,

          status:
            partner.status ?? null,

          profile_completed:
            partner.profile_completed ??
            null,
        });
      } catch (error) {
        console.error(
          "PARTNER SETTINGS LOAD ERROR:",
          error,
        );

        setAccount(null);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Tilin tietojen lataaminen epäonnistui.",
        );
      } finally {
        setLoading(false);
      }
    }, [router]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  async function updatePassword(
    password: string,
    confirmation: string,
  ) {
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Salasanassa täytyy olla vähintään 8 merkkiä.",
      );

      return false;
    }

    if (
      password !== confirmation
    ) {
      setErrorMessage(
        "Salasanat eivät täsmää.",
      );

      return false;
    }

    try {
      setUpdatingPassword(true);

      const { error } =
        await supabase.auth.updateUser(
          {
            password,
          },
        );

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Salasana vaihdettiin onnistuneesti.",
      );

      return true;
    } catch (error) {
      console.error(
        "PARTNER PASSWORD UPDATE ERROR:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Salasanan vaihtaminen epäonnistui.",
      );

      return false;
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function logout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setErrorMessage("");

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace(
        "/partner/login",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "PARTNER SETTINGS LOGOUT ERROR:",
        error,
      );

      setErrorMessage(
        "Uloskirjautuminen epäonnistui. Yritä uudelleen.",
      );

      setLoggingOut(false);
    }
  }

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  return {
    account,
    loading,
    updatingPassword,
    loggingOut,
    errorMessage,
    successMessage,

    updatePassword,
    logout,
    reload: loadAccount,
    clearMessages,
  };
}