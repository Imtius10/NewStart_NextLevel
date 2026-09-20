import app from "./app";
import { prisma } from "./lib/prisma";

const PORT=5000

async function main() {

    try {
        await prisma.$connect();
        console.log("connect to database");
        app.listen(PORT, () => {
            console.log("Runnit at ", PORT);
        });
        
    } catch (error) {
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    }
    
}


main();