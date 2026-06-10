"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CompletePartnerPage() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);

  const toggleService = (service: string) => {
    setServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  if (!partnerId) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Virhe</h1>
        <p>Partner ID puuttuu linkistä.</p>
      </main>
    );
  }

  if (saved) {
    return (
      <main style={{ padding: 40 }}>
        <h1>✅ Profiili tallennettu</h1>
        <p>Kiitos! Profiilisi on nyt täydennetty.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>🛠️ Täydennä profiilisi</h1>

      <h3>Palvelut</h3>
      {["Juhlatila", "Catering", "DJ / Musiikki", "Valokuvaus"].map(s => (
        <label key={s} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={services.includes(s)}
            onChange={() => toggleService(s)}
          />{" "}
          {s}
        </label>
      ))}

      <h3 style={{ marginTop: 20 }}>Kuvaus</h3>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Kerro yrityksestäsi ja palveluistasi"
        style={{
          width: "100%",
          minHeight: 120,
          padding: 12,
          marginBottom: 20,
        }}
      />

      <h3>Kuvat (max 5)</h3>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          setFiles(Array.from(e.target.files).slice(0, 5));
        }}
        style={{ marginBottom: 20 }}
      />

      <button
        onClick={async () => {
          if (!partnerId) return;

          const uploadedUrls: string[] = [];

          for (const file of files) {
            const path = `partners/${partnerId}/${Date.now()}-${file.name}`;

            const { error } = await supabase.storage
              .from("partner-images")
              .upload(path, file);

            if (error) {
              console.error(error);
              continue;
            }

            const { data } = supabase.storage
              .from("partner-images")
              .getPublicUrl(path);

            if (data?.publicUrl) {
              uploadedUrls.push(data.publicUrl);
            }
          }

          const { error } = await supabase
            .from("partners")
            .update({
              description,
              services,
              images: uploadedUrls,
            })
            .eq("id", partnerId);

          if (error) {
            alert("Tallennus epäonnistui");
            return;
          }

          setSaved(true);
        }}
        style={{
          padding: "12px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
        }}
      >
        Tallenna
      </button>
    </main>
  );
}