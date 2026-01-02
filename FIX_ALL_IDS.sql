-- FIX_ALL_IDS.sql
-- Este script configura o valor padrão das colunas ID e Timestamps para evitar erros "null value".
-- Execute isso no SQL Editor do Supabase para corrigir erros em TODAS as telas.

-- Habilita extensão pgcrypto (para UUIDs)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função auxiliar para atualizar updatedAt automaticamente (opcional, mas recomendado)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- --- COMPANY ---
ALTER TABLE "Company" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Company" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Company" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- PRODUCT ---
ALTER TABLE "Product" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Product" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- SALE ---
ALTER TABLE "Sale" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Sale" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Sale" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- SHIPMENT ---
ALTER TABLE "Shipment" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Shipment" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Shipment" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- TASK ---
ALTER TABLE "Task" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Task" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Task" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- BAZAR EVENT ---
ALTER TABLE "BazarEvent" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "BazarEvent" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "BazarEvent" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- FINANCIAL GOAL ---
ALTER TABLE "FinancialGoal" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "FinancialGoal" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "FinancialGoal" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- --- OUTROS ---
ALTER TABLE "ScheduledPost" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "Alert" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- FIX: Adicionado defaults para MediaKitBrand
ALTER TABLE "MediaKitBrand" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "MediaKitBrand" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "MediaKitBrand" ALTER COLUMN "updatedAt" SET DEFAULT now();
