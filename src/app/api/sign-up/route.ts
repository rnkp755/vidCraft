import { drizzle } from "drizzle-orm/neon-http";
import { users } from "@/db/schema/users";

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: Request) {
    try {
        const { createdUserId, firstName, lastName, emailAddress } =
            await req.json();

        const user: typeof users.$inferInsert = {
            id: createdUserId,
            name: `${firstName} ${lastName}`,
            email: emailAddress,
            is_subscribed: false,
            credits: 0,
            updated_at: new Date(),
            created_at: new Date(),
        };
        await db.insert(users).values([user]);

        return new Response(JSON.stringify({ status: "ok", data: user }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ status: "error", message: error.message }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
