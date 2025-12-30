-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "saleId" TEXT,
    "senderName" TEXT,
    "senderAddress" TEXT,
    "senderCity" TEXT,
    "senderState" TEXT,
    "senderCep" TEXT,
    "senderCpfCnpj" TEXT,
    "recipientName" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "recipientCity" TEXT NOT NULL,
    "recipientState" TEXT NOT NULL,
    "recipientCep" TEXT NOT NULL,
    "recipientCpfCnpj" TEXT,
    "weight" REAL NOT NULL,
    "height" REAL NOT NULL,
    "width" REAL NOT NULL,
    "length" REAL NOT NULL,
    "declaredValue" REAL,
    "carrier" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "contentDescription" TEXT,
    "contentQuantity" INTEGER NOT NULL DEFAULT 1,
    "trackingCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "labelGenerated" INTEGER NOT NULL DEFAULT 0,
    "declarationGenerated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("carrier", "contentDescription", "contentQuantity", "createdAt", "declarationGenerated", "declaredValue", "deliveryTime", "height", "id", "labelGenerated", "length", "price", "recipientAddress", "recipientCep", "recipientCity", "recipientCpfCnpj", "recipientName", "recipientState", "saleId", "senderAddress", "senderCep", "senderCity", "senderCpfCnpj", "senderName", "senderState", "status", "trackingCode", "updatedAt", "userId", "weight", "width") SELECT "carrier", "contentDescription", "contentQuantity", "createdAt", "declarationGenerated", "declaredValue", "deliveryTime", "height", "id", "labelGenerated", "length", "price", "recipientAddress", "recipientCep", "recipientCity", "recipientCpfCnpj", "recipientName", "recipientState", "saleId", "senderAddress", "senderCep", "senderCity", "senderCpfCnpj", "senderName", "senderState", "status", "trackingCode", "updatedAt", "userId", "weight", "width" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
CREATE UNIQUE INDEX "Shipment_trackingCode_key" ON "Shipment"("trackingCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
