-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "senderCity" TEXT NOT NULL,
    "senderState" TEXT NOT NULL,
    "senderCep" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingCode_key" ON "Shipment"("trackingCode");
