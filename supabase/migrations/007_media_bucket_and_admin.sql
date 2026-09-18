-- Media storage bucket + bootstrap super_admin.
--
-- The app uploads through the service-role client (src/lib/upload.ts), which
-- bypasses storage RLS, so no storage policies are needed. The bucket is public
-- because the code serves images via getPublicUrl().

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media', 'media', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Promote the existing auth user to super_admin. Passwords never belong in a
-- migration, so create the auth user first (Dashboard -> Authentication -> Users,
-- Auto Confirm on). If it does not exist yet this is a no-op and the notice says so;
-- create the user, then run this INSERT ... SELECT once by hand.
INSERT INTO public.users (id, email, full_name, role, is_active)
SELECT id, email, 'Admin', 'super_admin', true
FROM auth.users
WHERE email = 'admin@seoexpertagency.co.uk'
ON CONFLICT (id) DO UPDATE
  SET role = 'super_admin', is_active = true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@seoexpertagency.co.uk') THEN
    RAISE NOTICE 'No auth user for admin@seoexpertagency.co.uk yet - create it, then re-run the admin INSERT.';
  END IF;
END $$;
