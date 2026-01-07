-- ==========================================
-- SCRIPT DE CORREÇÃO DE SEGURANÇA (RLS) - COM ACESSO ADMIN MASTER
-- ==========================================
-- Este script habilita a segurança a nível de linha (RLS) e cria políticas.
-- REGRA GERAL:
-- 1. Usuários comuns veem APENAS seus próprios dados.
-- 2. O ADMIN MASTER (a77773a8-67bb-4037-9ae7-8067186d7e3e) vê TUDO.

-- 0. Tabela de Usuários (User - Dados Sensíveis)
-- -------------------------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "User";
DROP POLICY IF EXISTS "Public Access" ON "User";

-- Leitura: Próprio usuário OU Admin Master
CREATE POLICY "Users and Admin read profiles" ON "User"
FOR SELECT USING (
  id = auth.uid()::text 
  OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e'
);

-- Atualização: Próprio usuário OU Admin Master
CREATE POLICY "Users and Admin update profiles" ON "User"
FOR UPDATE USING (
  id = auth.uid()::text 
  OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e'
);

-- Deleção: APENAS Admin Master (ou self-delete se desejado, aqui deixamos restrito)
CREATE POLICY "Admin delete profiles" ON "User"
FOR DELETE USING (
  auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e'
);

-- Inserção: Permitir que o sistema de Auth/Triggers crie (ou publico se for signup direto)
-- Geralmente INSERT é liberado para authService ou trigger, mas vamos deixar aberto para autenticados
-- para garantir que o fluxo de cadastro não quebre se feito via API cliente.
CREATE POLICY "Enable insert for authenticated users only" ON "User" 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 1. Tabelas Críticas (Vendas, Financeiro, Produtos, Envios, Empresas)
-- -------------------------------------------------------------------

-- Vendas (Sale)
ALTER TABLE "Sale" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON "Sale"; 
DROP POLICY IF EXISTS "Enable all access for all users" ON "Sale";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Sale";
CREATE POLICY "Owner and Admin Access" ON "Sale"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Transações Financeiras (FinancialTransaction)
ALTER TABLE "FinancialTransaction" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON "FinancialTransaction";
DROP POLICY IF EXISTS "Enable all access for all users" ON "FinancialTransaction";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "FinancialTransaction";
CREATE POLICY "Owner and Admin Access" ON "FinancialTransaction"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Produtos (Product)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON "Product";
DROP POLICY IF EXISTS "Enable all access for all users" ON "Product";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Product";
CREATE POLICY "Owner and Admin Access" ON "Product"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Empresas (Company)
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON "Company";
DROP POLICY IF EXISTS "Enable all access for all users" ON "Company";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Company";
CREATE POLICY "Owner and Admin Access" ON "Company"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Envios (Shipment)
ALTER TABLE "Shipment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON "Shipment";
DROP POLICY IF EXISTS "Enable all access for all users" ON "Shipment";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Shipment";
CREATE POLICY "Owner and Admin Access" ON "Shipment"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Metas Financeiras (FinancialGoal)
ALTER TABLE "FinancialGoal" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "FinancialGoal";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "FinancialGoal";
CREATE POLICY "Owner and Admin Access" ON "FinancialGoal"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Despesas Recorrentes (RecurringExpense)
ALTER TABLE "RecurringExpense" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "RecurringExpense";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "RecurringExpense";
CREATE POLICY "Owner and Admin Access" ON "RecurringExpense"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- 2. Serviços e Utilitários (Afiliados, Agenda, Tarefas)
-- -----------------------------------------------------

-- Afiliados
ALTER TABLE "AffiliatePlatform" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "AffiliatePlatform";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "AffiliatePlatform";
CREATE POLICY "Owner and Admin Access" ON "AffiliatePlatform"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "AffiliateEarning" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "AffiliateEarning";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "AffiliateEarning";
CREATE POLICY "Owner and Admin Access" ON "AffiliateEarning"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Tarefas (Task)
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Task";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Task";
CREATE POLICY "Owner and Admin Access" ON "Task"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Posts Agendados (ScheduledPost)
ALTER TABLE "ScheduledPost" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "ScheduledPost";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "ScheduledPost";
CREATE POLICY "Owner and Admin Access" ON "ScheduledPost"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Alertas e Notificações
ALTER TABLE "Alert" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Alert";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Alert";
CREATE POLICY "Owner and Admin Access" ON "Alert"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Notification";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Notification";
CREATE POLICY "Owner and Admin Access" ON "Notification"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "Insight" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Insight";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Insight";
CREATE POLICY "Owner and Admin Access" ON "Insight"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "BazarEvent" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "BazarEvent";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "BazarEvent";
CREATE POLICY "Owner and Admin Access" ON "BazarEvent"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "Opportunity" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Opportunity";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "Opportunity";
CREATE POLICY "Owner and Admin Access" ON "Opportunity"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "BugReport" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "BugReport";
DROP POLICY IF EXISTS "Owner and Admin Access" ON "BugReport";
CREATE POLICY "Owner and Admin Access" ON "BugReport"
USING ("userId" = auth.uid()::text OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- 3. Tabelas Públicas ou de Sistema (Leitura permitida para todos, Escrita restrita)
-- ---------------------------------------------------------------------------------

-- Planos (Plan) - Leitura Pública
ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "Plan";
CREATE POLICY "Public read plans" ON "Plan" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Write Plans" ON "Plan";
CREATE POLICY "Admin Write Plans" ON "Plan" FOR ALL USING (auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Categorias de Produtos
ALTER TABLE "product_categories" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "product_categories";
CREATE POLICY "Public read categories" ON "product_categories" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Write categories" ON "product_categories";
CREATE POLICY "Admin Write categories" ON "product_categories" FOR ALL USING (auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Produtos em Tendência
ALTER TABLE "trending_products" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "trending_products";
CREATE POLICY "Public read trending" ON "trending_products" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Write trending" ON "trending_products";
CREATE POLICY "Admin Write trending" ON "trending_products" FOR ALL USING (auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

ALTER TABLE "trend_history" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "trend_history";
CREATE POLICY "Public read trend history" ON "trend_history" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Write trend history" ON "trend_history";
CREATE POLICY "Admin Write trend history" ON "trend_history" FOR ALL USING (auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Comuniade (Posts)
ALTER TABLE "CommunityPost" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read posts" ON "CommunityPost";
CREATE POLICY "Public read posts" ON "CommunityPost" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create posts" ON "CommunityPost";
CREATE POLICY "Users can create posts" ON "CommunityPost" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
DROP POLICY IF EXISTS "Users can update own posts" ON "CommunityPost";
CREATE POLICY "Users can update own posts" ON "CommunityPost" FOR UPDATE USING (auth.uid()::text = "userId" OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');
DROP POLICY IF EXISTS "Users can delete own posts" ON "CommunityPost";
CREATE POLICY "Users can delete own posts" ON "CommunityPost" FOR DELETE USING (auth.uid()::text = "userId" OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Comentários
ALTER TABLE "PostComment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "PostComment";
CREATE POLICY "Public read comments" ON "PostComment" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create comments" ON "PostComment";
CREATE POLICY "Users can create comments" ON "PostComment" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
DROP POLICY IF EXISTS "Users can update own comments" ON "PostComment";
CREATE POLICY "Users can update own comments" ON "PostComment" FOR UPDATE USING (auth.uid()::text = "userId" OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');
DROP POLICY IF EXISTS "Users can delete own comments" ON "PostComment";
CREATE POLICY "Users can delete own comments" ON "PostComment" FOR DELETE USING (auth.uid()::text = "userId" OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');

-- Reações (Likes)
ALTER TABLE "PostReaction" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for all users" ON "PostReaction";
CREATE POLICY "Public read reactions" ON "PostReaction" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can react" ON "PostReaction";
CREATE POLICY "Users can react" ON "PostReaction" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
DROP POLICY IF EXISTS "Users can remove own reaction" ON "PostReaction";
CREATE POLICY "Users can remove own reaction" ON "PostReaction" FOR DELETE USING (auth.uid()::text = "userId" OR auth.uid()::text = 'a77773a8-67bb-4037-9ae7-8067186d7e3e');
