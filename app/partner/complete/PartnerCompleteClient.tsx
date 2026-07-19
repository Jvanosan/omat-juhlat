"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ProfileHeader from "@/app/components/partner/ProfileHeader";
import ProfileProgress from "@/app/components/partner/ProfileProgress";
import BasicInfoCard from "@/app/components/partner/BasicInfoCard";
import LocationCard from "@/app/components/partner/LocationCard";
import ServicesCard from "@/app/components/partner/ServicesCard";
import GalleryCard from "@/app/components/partner/GalleryCard";
import ExtraInfoCard from "@/app/components/partner/ExtraInfoCard";
import PreviewCard from "@/app/components/partner/PreviewCard";
export default function PartnerCompleteClient() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [progress, setProgress] = useState(0);
 const [existingSlug, setExistingSlug] = useState("");
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",

    description: "",

    category: "",
    services: "",

    city: "",
    address: "",
    postal_code: "",

    website: "",

    logo_url: "",
    cover_image_url: "",
    gallery_urls: "",

    min_guests: "",
    max_guests: "",
    avg_price_level: "",

    parking: false,
    accessibility: false,

    instagram_url: "",
    facebook_url: "",
    tiktok_url: "",

    opening_hours: "",
    additional_info: "",
  });

  function updateField(name: string, value: any) {
  setForm((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    setProgress(calculateProfileProgress(updated));

    return updated;
  });
}

  function calculateProfileProgress(currentForm = form) {
  let score = 0;

  if (currentForm.company.trim()) score += 10;
  if (currentForm.email.trim()) score += 10;
  if (currentForm.phone.trim()) score += 10;
  if (currentForm.logo_url.trim()) score += 15;

  const hasImage =
    currentForm.cover_image_url.trim() ||
    currentForm.gallery_urls.trim();

  if (hasImage) score += 15;

  if (currentForm.category.trim()) score += 10;
  if (currentForm.services.trim()) score += 10;
  if (currentForm.description.trim()) score += 10;
  if (currentForm.city.trim()) score += 5;
  if (currentForm.address.trim()) score += 5;

  return Math.min(score, 100);
}
  useEffect(() => {
    if (!partnerId) {
      setLoading(false);
      return;
    }

    loadPartner();
  }, [partnerId]);

  async function loadPartner() {
  if (!partnerId) {
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase
      .from("partners")
      .select(`
        id,
        company,
        email,
        phone,
        description,
        category,
        services,
        area,
        address,
        postal_code,
        website,
        logo_url,
        cover_image_url,
        images,
        max_guests,
        avg_price_level,
        parking,
        accessibility,
        instagram_url,
        facebook_url,
        tiktok_url,
        opening_hours,
        profile_completed,
        profile_completion,
        slug
      `)
      .eq("id", partnerId)
      .maybeSingle();

    if (error) {
      console.error("Partnerin lataus epäonnistui:", error);
      alert("Partnerin tietojen lataaminen epäonnistui.");
      return;
    }

    if (!data) {
      alert("Partneria ei löytynyt.");
      return;
    }
    setExistingSlug(data.slug ?? "");

    setForm((prev) => ({
      ...prev,

      company: data.company ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      description: data.description ?? "",

      category: data.category ?? "",
      services: data.services ?? "",

      city: data.area ?? "",
      address: data.address ?? "",
      postal_code: data.postal_code ?? "",

      website: data.website ?? "",

      logo_url: data.logo_url ?? "",
      cover_image_url: data.cover_image_url ?? "",
      gallery_urls: data.images ?? "",

      max_guests:
        data.max_guests !== null && data.max_guests !== undefined
          ? String(data.max_guests)
          : "",

      avg_price_level: data.avg_price_level ?? "",

      parking: Boolean(data.parking),
      accessibility: Boolean(data.accessibility),

      instagram_url: data.instagram_url ?? "",
      facebook_url: data.facebook_url ?? "",
      tiktok_url: data.tiktok_url ?? "",

      opening_hours: data.opening_hours ?? "",
    }));

    setProgress(calculateProfileProgress({
  ...form,
  company: data.company ?? "",
  email: data.email ?? "",
  phone: data.phone ?? "",
  description: data.description ?? "",
  category: data.category ?? "",
  services: data.services ?? "",
  city: data.area ?? "",
  address: data.address ?? "",
  logo_url: data.logo_url ?? "",
  cover_image_url: data.cover_image_url ?? "",
  gallery_urls: data.images ?? "",
}));

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
  } catch (error) {
    console.error("Odottamaton latausvirhe:", error);
    alert("Partnerin tietojen lataamisessa tapahtui virhe.");
  } finally {
    setLoading(false);
  }
}

  async function saveProfile() {
  if (!partnerId) {
    alert("Partner ID puuttuu.");
    return;
  }

  if (!form.company.trim()) {
    alert("Lisää yrityksen nimi.");
    return;
  }

  setSaving(true);

  try {
    const completion = calculateProfileProgress(form);

    const hasImage = Boolean(
      form.cover_image_url.trim() || form.gallery_urls.trim()
    );

    const profileCompleted = Boolean(
      form.company.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.logo_url.trim() &&
        hasImage &&
        form.category.trim() &&
        form.services.trim()
    );

    const generatedSlug =
      existingSlug ||
      `${createSlug(form.company)}-${String(partnerId).slice(0, 8)}`;

    const maxGuests =
      form.max_guests.trim() === ""
        ? null
        : Number(form.max_guests);

    if (
      maxGuests !== null &&
      (!Number.isFinite(maxGuests) || maxGuests < 1)
    ) {
      alert("Tarkista maksimivierasmäärä.");
      return;
    }

    const { error } = await supabase
      .from("partners")
      .update({
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        description: form.description.trim(),

        category: form.category.trim(),
        services: form.services
          .split(",")
          .map((service) => service.trim())
          .filter(Boolean)
          .join(","),

        area: form.city.trim(),
        address: form.address.trim(),
        postal_code: form.postal_code.trim(),

        website: form.website.trim(),

        logo_url: form.logo_url.trim(),
        cover_image_url: form.cover_image_url.trim(),
        images: form.gallery_urls.trim(),

        max_guests: maxGuests,
        avg_price_level: form.avg_price_level,

        parking: form.parking,
        accessibility: form.accessibility,

        instagram_url: form.instagram_url.trim(),
        facebook_url: form.facebook_url.trim(),
        tiktok_url: form.tiktok_url.trim(),

        opening_hours: form.opening_hours.trim(),

        profile_completion: completion,
        profile_completed: profileCompleted,
        slug: generatedSlug,
      })
      .eq("id", partnerId);

    if (error) {
      console.error("Profiilin tallennus epäonnistui:", error);
      alert(`Profiilin tallennus epäonnistui: ${error.message}`);
      return;
    }

    setProgress(completion);
    setExistingSlug(generatedSlug);

    if (profileCompleted) {
      alert("Profiili tallennettiin ja se on valmis julkaistavaksi! 🎉");
    } else {
      alert(
        `Profiili tallennettiin. Profiilin valmius on ${completion} %. Täytä vielä puuttuvat pakolliset tiedot.`
      );
    }
  } catch (error) {
    console.error("Odottamaton tallennusvirhe:", error);
    alert("Profiilin tallentamisessa tapahtui odottamaton virhe.");
  } finally {
    setSaving(false);
  }
}

  if (!partnerId) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Partner ID puuttuu.</h2>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Ladataan...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <ProfileHeader
        companyName={form.company}
        onBack={() => history.back()}
        onLogout={() => {}}
      />

      <ProfileProgress
        currentStep={6}
        totalSteps={6}
      />

      <BasicInfoCard
        form={form}
        onChange={updateField}
      />

      <LocationCard
        form={form}
        onChange={updateField}
      />

      <ServicesCard
        form={form}
        onChange={updateField}
      />

      <GalleryCard
        form={form}
        onChange={updateField}
      />

      <ExtraInfoCard
        form={form}
        onChange={updateField}
      />

      <PreviewCard form={form} />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 32,
        }}
      >
        <button
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Tallennetaan..." : "Tallenna profiili"}
        </button>
      </div>
    </main>
  );
}