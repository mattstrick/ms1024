import { sql } from "@vercel/postgres";

export async function getToolsFromDb() {
    const { rows } = await sql`SELECT * from MS1024_Tools`;

    return rows;
}

export async function getRentalFeesFromDb() {
    const { rows } = await sql`SELECT * from MS1024_Rental_Fees`;

    return rows;
}
 