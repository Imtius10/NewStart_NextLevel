import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const users = [
  // Admins
  { name: "Admin One", email: "admin@rentnest.com", password: "admin123", role: "ADMIN" },
  { name: "Admin Two", email: "admin2@rentnest.com", password: "admin123", role: "ADMIN" },
  { name: "Imtius Admin", email: "imtius3@example.com", password: "12345678", role: "ADMIN" },

  // Landlords
  { name: "Imtius Ahmed", email: "imtius1@example.com", password: "12345678", role: "LANDLORD" },
  { name: "Rahim Uddin", email: "rahim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Karim Ahmed", email: "karim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Jamal Hossain", email: "jamal@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Salim Khan", email: "salim@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Faruk Sheikh", email: "faruk@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Babul Das", email: "babul@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Nabil Rahman", email: "nabil@landlord.com", password: "123456", role: "LANDLORD" },
  { name: "Tareq Hasan", email: "tareq@landlord.com", password: "123456", role: "LANDLORD" },

  // Tenants
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

const properties = [
  { title: "Luxury Apartment in Gulshan", description: "Modern 3-bedroom apartment with beautiful city view, swimming pool and gym access.", price: 45000, location: "Gulshan, Dhaka", category: "apartment" },
  { title: "Cozy Studio in Banani", description: "Fully furnished studio apartment, perfect for young professionals. Close to restaurants and cafes.", price: 22000, location: "Banani, Dhaka", category: "studio" },
  { title: "Family House in Mirpur", description: "Spacious 4-bedroom house with backyard, perfect for families. Near schools and markets.", price: 35000, location: "Mirpur, Dhaka", category: "house" },
  { title: "Modern Condo in Dhanmondi", description: "2-bedroom condo with rooftop access, 24/7 security and parking.", price: 28000, location: "Dhanmondi, Dhaka", category: "condo" },
  { title: "Penthouse in Uttara", description: "Exclusive penthouse with panoramic views, private terrace and premium finishes.", price: 65000, location: "Uttara, Dhaka", category: "penthouse" },
  { title: "Budget Apartment in Mohammadpur", description: "Affordable 2-bedroom apartment, great for students and small families.", price: 15000, location: "Mohammadpur, Dhaka", category: "apartment" },
  { title: "Executive Suite in Motijheel", description: "Premium office-compatible apartment in the business district. Ideal for executives.", price: 40000, location: "Motijheel, Dhaka", category: "suite" },
  { title: "Garden House in Bashundhara", description: "Elegant 5-bedroom house with private garden, home theater and modern kitchen.", price: 85000, location: "Bashundhara R/A, Dhaka", category: "house" },
  { title: "Riverside Apartment in Tejgaon", description: "Beautiful apartment with river view, balcony and modern amenities.", price: 30000, location: "Tejgaon, Dhaka", category: "apartment" },
  { title: "Smart Studio in Elephant Road", description: "Compact smart home with automated systems, perfect for tech-savvy tenants.", price: 18000, location: "Elephant Road, Dhaka", category: "studio" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  const imtiusPassword = await bcrypt.hash("12345678", 10);
  const adminHashedPassword = await bcrypt.hash("admin123", 10);

  let usersCreated = 0;
  let usersSkipped = 0;

  // Create users
  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      usersSkipped++;
      continue;
    }

    const password = user.email === "imtius1@example.com"
      ? imtiusPassword
      : user.email === "imtius3@example.com"
        ? adminHashedPassword
        : user.role === "ADMIN"
          ? adminHashedPassword
          : hashedPassword;

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: password,
        role: user.role as any,
        activeStatus: "ACTIVE",
      },
    });

    usersCreated++;
    console.log(`Created user: ${user.name} (${user.email}) - ${user.role}`);
  }

  // Create 10 properties for imtius1
  const landlord = await prisma.user.findUnique({
    where: { email: "imtius1@example.com" },
  });

  if (landlord) {
    let propsCreated = 0;
    let propsSkipped = 0;

    for (const prop of properties) {
      const existing = await prisma.property.findFirst({
        where: {
          title: prop.title,
          landlordId: landlord.id,
        },
      });

      if (existing) {
        propsSkipped++;
        continue;
      }

      await prisma.property.create({
        data: {
          title: prop.title,
          description: prop.description,
          price: prop.price,
          location: prop.location,
          category: prop.category,
          landlordId: landlord.id,
        },
      });

      propsCreated++;
      console.log(`Created property: ${prop.title}`);
    }

    console.log(`\nProperties - Created: ${propsCreated}, Skipped: ${propsSkipped}`);
  }

  console.log(`\nUsers - Created: ${usersCreated}, Skipped: ${usersSkipped}`);

  // Print test accounts
  console.log("\n========== TEST ACCOUNTS ==========");
  console.log("ADMIN:");
  console.log("  admin@rentnest.com / admin123");
  console.log("  imtius3@example.com / 12345678");
  console.log("\nLANDLORD (with properties):");
  console.log("  imtius1@example.com / 12345678  <-- 10 properties");
  console.log("\nTENANTS:");
  console.log("  tanvir@tenant.com / 123456");
  console.log("  sakib@tenant.com / 123456");
  console.log("  adnan@tenant.com / 123456");
  console.log("  imran@tenant.com / 123456");
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
