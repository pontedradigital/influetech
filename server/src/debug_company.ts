
import db from './db';

const MOCK_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896'; // Mock or valid ID from your user table

async function testCompanyCreation() {
    try {
        console.log("Tentando criar empresa...");
        const company = await db.company.create({
            data: {
                name: "Teste Company 123",
                contactName: "John Doe",
                email: "contact@test.com",
                phone: "123456789",
                country: "Brazil",
                website: "https://test.com",
                // contactMethod missing on purpose or null? Controller passes undefined?
                // contactValue missing?
                partnershipStatus: "Solicitada",
                status: "ACTIVE",
                rating: 0,
                userId: MOCK_USER_ID
            }
        });
        console.log("Empresa criada com sucess:", company);
    } catch (e: any) {
        console.error("Erro detalhado ao criar empresa:", e);
    } finally {
        await db.$disconnect();
    }
}

testCompanyCreation();
