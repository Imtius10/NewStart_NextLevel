import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const users = [
  // 2 Admins
  { name: "Admin One", email: "admin@rentnest.com", password: "admin123", role: "ADMIN" },
  { name: "Admin Two", email: "admin2@rentnest.com", password: "admin123", role: "ADMIN" },

  // 8 Landlords
  { name: "Rahim Uddin", email: "rahim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Karim Ahmed", email: "karim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Jamal Hossain", email: "jamal@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Salim Khan", email: "salim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Faruk Sheikh", email: "faruk@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Babul Das", email: "babul@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Nabil Rahman", email: "nabil@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Tareq Hasan", email: "tareq@landlord.com", password: "123456", role: "LANDLORD" },

  // 10 Tenants
  { name: "Tanvir Alam", email: "tanvir@tenant.com", password: "123456", role: "TENANT" },
  { name: "Sakib Mirza", email: "sakib@tenant.com", password: "123456", role: "TENANT" },
  { name: "Adnan Farooq", email: "adnan@tenant.com", password: "123456", role: "TENANT" },
  { name: "Imran Patel", email: "imran@tenant.com", password: "123456", role: "TENANT" },
  { name: "Rafiq Islam", email: "rafiq@tenant.com", password: "123456", role: "TENANT" },
  { name: "Mizanur Haq", email: "mizan@tenant.com", password: "123456", role: "TENANT" },
  { name: "Shahin Akter", email: "shahin@tenant.com", password: "123456", role: "TENANT" },
  { name: "Omar Faruk", email: "omar@tenant.com", password: "123456", role: "TENANT" },
  { name: "Habib Rahman", email: "habib@tenant.com", password: "123456", role: "TENANT" },
  { name: "Zahid Hasan", email: "zahid@tenant.com", password: "123456", role: "TENANT" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  const adminHashedPassword = await bcrypt.hash("admin123", 10);

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const password = user.role === "ADMIN" ? adminHashedPassword : hashedPassword;

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: password,
        role: user.role as any,
        activeStatus: "ACTIVE",
      },
    });

    created++;
    console.log(`Created: ${user.name} (${user.email}) - ${user.role}`);
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);

  // Print all test accounts
  console.log("\n========== TEST ACCOUNTS ==========");
  console.log("ADMIN:");
  console.log("  admin@rentnest.com / admin123");
  console.log("  admin2@rentnest.com / admin123");
  console.log("\nLANDLORDS:");
  console.log("  rahim@landlord.com / 123456");
  console.log("  karim@landlord.com / 123456");
  console.log("  jamal@landlord.com / 123456");
  console.log("  salim@landlord.com / 123456");
  console.log("  faruk@landlord.com / 123456");
  console.log("  babul@landlord.com / 123456");
  console.log("  nabil@landlord.com / 123456");
  console.log("  tareq@landlord.com / 123456");
  console.log("\nTENANTS:");
  console.log("  tanvir@tenant.com / 123456");
  console.log("  sakib@tenant.com / 123456");
  console.log("  adnan@tenant.com / 123456");
  console.log("  imran@tenant.com / 123456");
  console.log("  rafiq@tenant.com / 123456");
  console.log("  mizan@tenant.com / 123456");
  console.log("  shahin@tenant.com / 123456");
  console.log("  omar@tenant.com / 123456");
  console.log("  habib@tenant.com / 123456");
  console.log("  zahid@tenant.com / 123456");
  console.log("====================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
