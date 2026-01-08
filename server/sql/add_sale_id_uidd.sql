-- Add saleId column to FinancialTransaction
ALTER TABLE "FinancialTransaction" ADD COLUMN "sale_id" TEXT;

-- Add Foreign Key constraint with Cascade Delete
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create Index for performance (optional but recommended)
CREATE INDEX "FinancialTransaction_sale_id_idx" ON "FinancialTransaction"("sale_id");
