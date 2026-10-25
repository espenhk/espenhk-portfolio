CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- One row per document: 'draft' (admin only) and 'published' (public read)
CREATE TABLE public.cms_documents (
  id text PRIMARY KEY CHECK (id IN ('draft','published')),
  doc jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_documents TO authenticated;
GRANT ALL ON public.cms_documents TO service_role;
ALTER TABLE public.cms_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published" ON public.cms_documents FOR SELECT TO anon, authenticated USING (id = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin inserts" ON public.cms_documents FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin updates" ON public.cms_documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes" ON public.cms_documents FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cms_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc jsonb NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.cms_revisions TO authenticated;
GRANT ALL ON public.cms_revisions TO service_role;
ALTER TABLE public.cms_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin all revisions" ON public.cms_revisions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read cms files" ON storage.objects FOR SELECT USING (bucket_id = 'cms-files');
CREATE POLICY "Admin upload cms files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update cms files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete cms files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-files' AND public.has_role(auth.uid(), 'admin'));