import { supabase } from "@/lib/supabaseClient";

const DEFAULT_BUCKET =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env &&
    ((import.meta as unknown as { env: Record<string, string> }).env["VITE_SUPABASE_STORAGE_BUCKET"] || "")) ||
  "solusimedsos";

export async function uploadImage(file: File, bucket?: string): Promise<string> {
  if (!file) throw new Error("File tidak ditemukan");

  const targetBucket = bucket || DEFAULT_BUCKET;
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const fileName = `${unique}.${ext}`;

  const { error } = await supabase.storage.from(targetBucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });

  if (error) {
    const msg = error?.message || "Upload gagal";
    if (msg.toLowerCase().includes("bucket not found")) {
      throw new Error(`Bucket "${targetBucket}" tidak ditemukan. Pastikan bucket ada atau set VITE_SUPABASE_STORAGE_BUCKET ke nama bucket yang benar.`);
    }
    throw new Error(msg);
  }

  const signed = await supabase.storage.from(targetBucket).createSignedUrl(fileName, 60 * 60 * 24 * 365);
  if (signed.data?.signedUrl) {
    return signed.data.signedUrl;
  }

  const { data } = supabase.storage.from(targetBucket).getPublicUrl(fileName);
  return data.publicUrl;
}
