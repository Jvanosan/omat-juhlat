"use client";

import { supabase } from "../../lib/supabase";
``
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "#6c757d",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      🔓 Logout
    </button>
  );
}