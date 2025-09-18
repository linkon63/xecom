"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileInfoPage() {
  console.log("hit profile after the login complete");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", profilePicture: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        console.log("hello profile page");
        const res = await fetch("/api/profile", { cache: "no-store" });
        console.log("res from profile page", res);
        if (res.status === 401) {
          if (typeof window !== "undefined") {
            const cb = encodeURIComponent("/profile/profileinfo");
            window.location.href = `/sign-in?redirect_url=${cb}`;
          }
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load profile");
        if (!cancelled) {
          setProfile(data);
          setForm({
            name: data?.name || "",
            phone: data?.phone || "",
            profilePicture: data?.profilePicture || "",
          });
        }
      } catch (e: any) {
        console.log("error", e.message);
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // handle profile picture change
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.error || "Failed to upload profile picture");
    setForm((s) => ({ ...s, profilePicture: data.url }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");
      setProfile(data.user);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Profile info</h2>
      {loading && <div className="text-sm text-gray-600">Loading...</div>}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}
      {!loading && (
        <form onSubmit={onSubmit} className="grid gap-4">
          {/* show the profile picture in the circle */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {form.profilePicture ? (
                <Image
                  src={form.profilePicture}
                  alt="Profile picture"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="profilePicture">
                Profile picture
              </label>
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* <div>
            <label className="block text-sm mb-1" htmlFor="profilePicture">
              Profile picture URL
            </label>
            <input
              id="profilePicture"
              name="profilePicture"
              value={form.profilePicture}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div> */}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
