// Lightweight uploader to Supabase Storage using REST API
// Requires envs: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_BUCKET

function randomFileName(originalName) {
  const ext = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '';
  const base = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${base}${ext}`;
}

export async function uploadToSupabase(file, directory = "menu") {
  const url = import.meta?.env?.VITE_SUPABASE_URL;
  const anon = import.meta?.env?.VITE_SUPABASE_ANON_KEY;
  const bucket = import.meta?.env?.VITE_SUPABASE_BUCKET;

  if (!url || !anon || !bucket) {
    throw new Error("Missing Supabase envs (URL, ANON KEY, BUCKET)");
  }

  const fileName = `${directory}/${randomFileName(file.name)}`;
  const endpoint = `${url.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(bucket)}/${fileName}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anon}`,
      apikey: anon,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed with status ${res.status}`);
  }

  // Public URL (requires bucket to be public)
  const publicUrl = `${url.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(bucket)}/${fileName}`;
  return { path: fileName, url: publicUrl };
}





