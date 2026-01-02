-- 1. Criar coluna para URL do logo na tabela Company
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;

-- 2. Bucket de Storage (execute apenas se ainda não existir o bucket 'company-logos')
-- Você pode fazer isso visualmente no menu "Storage" do Supabase:
--    a. Create new bucket
--    b. Name: "company-logos"
--    c. Public bucket: Checked (Sim)

-- OU via SQL (se tiver permissão de superusuário):
insert into storage.buckets (id, name, public) values ('company-logos', 'company-logos', true);

-- Políticas de Segurança (RLS) para o Storage
create policy "Public Access" on storage.objects for select using ( bucket_id = 'company-logos' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'company-logos' and auth.uid()::text = (storage.foldername(name))[1] );
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'company-logos' and auth.uid()::text = (storage.foldername(name))[1] );
