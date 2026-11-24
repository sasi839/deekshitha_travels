import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials safely from Vite environment variables or process.env
const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : (typeof process !== "undefined" && process.env ? process.env : {});
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

/**
 * Diagnostic key inspection helper to detect unsafe secret key leakage in the browser.
 * Supabase secret keys start with 'sb_secret_' and must NEVER be used in frontend client code.
 * Safe public keys begin with 'sb_publishable_' or legacy JWT format 'eyJ...'.
 */
export const getSupabaseConfigStatus = () => {
  const isUrlValid = Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseUrl !== "https://your-project-ref.supabase.co" &&
    !supabaseUrl.includes("PASTE_YOUR")
  );

  const hasKey = Boolean(
    supabaseAnonKey &&
    !supabaseAnonKey.includes("PASTE_YOUR")
  );

  const isSecretKey = Boolean(
    supabaseAnonKey && (
      supabaseAnonKey.startsWith("sb_secret_") ||
      supabaseAnonKey.includes("service_role")
    )
  );

  const isPublishableKey = Boolean(
    hasKey && !isSecretKey && (
      supabaseAnonKey.startsWith("sb_publishable_") ||
      supabaseAnonKey.startsWith("eyJ")
    )
  );

  return {
    isConfigured: isUrlValid && hasKey && !isSecretKey,
    isUrlValid,
    hasKey,
    isSecretKey,
    isPublishableKey,
    supabaseUrl
  };
};

export const isSupabaseConfigured = () => {
  return getSupabaseConfigStatus().isConfigured;
};

// Log immediate security warning if a secret key is detected in the browser
if (typeof window !== "undefined") {
  const status = getSupabaseConfigStatus();
  if (status.isSecretKey) {
    console.error(
      "🛑 SECURITY WARNING: A Supabase Secret API Key ('sb_secret_...') was detected in frontend environment variables (VITE_SUPABASE_ANON_KEY).\n" +
      "Secret keys have administrative privileges and are rejected by Supabase API Gateway with 'Forbidden use of secret API key in browser'.\n" +
      "To resolve this, replace VITE_SUPABASE_ANON_KEY in your .env file with your project's Publishable/Anon key (starts with 'sb_publishable_' or 'eyJ...')."
    );
  }
}

// Create Supabase client singleton only when safe, non-secret credentials are provided
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Storage Helpers
 */
export async function uploadToStorage(bucketName, file) {
  if (!supabase) throw new Error("Supabase is not configured.");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit. Please upload a smaller image.");
  }

  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = cleanFileName;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    throw new Error(`Upload to ${bucketName} failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: urlData.publicUrl
  };
}

export async function deleteFromStorage(bucketName, fileUrlOrPath) {
  if (!supabase || !fileUrlOrPath) return;

  try {
    // Extract file path from URL if a full URL was passed
    let path = fileUrlOrPath;
    if (fileUrlOrPath.includes(`/storage/v1/object/public/${bucketName}/`)) {
      path = fileUrlOrPath.split(`/storage/v1/object/public/${bucketName}/`)[1];
    } else if (fileUrlOrPath.startsWith("http")) {
      const urlParts = fileUrlOrPath.split("/");
      path = urlParts[urlParts.length - 1];
    }

    if (path && !path.startsWith("/images/")) {
      await supabase.storage.from(bucketName).remove([path]);
    }
  } catch (err) {
    console.warn("Storage deletion error (non-fatal):", err);
  }
}
