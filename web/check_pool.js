
const { PrismaClient } = require('@prisma/client');

// Hardcode the pooled URL to verify it works LOCALLY
// If this works locally, but Vercel fails, it is 100% IP blocking.
const url = "postgresql://postgres:E4CTTdOiwNv3VPmD@db.betffqdeopihcfpqnoay.supabase.co:6543/postgres?pgbouncer=true";
console.log("Testing Pooled Connection String...");

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
});

async function main() {
    try {
        const count = await prisma.user.count();
        console.log("✅ Connection Success! User count: " + count);
    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
    }
}

main().finally(() => prisma.$disconnect());
