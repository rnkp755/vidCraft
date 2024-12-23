import {
    text,
    boolean,
    pgTable,
    timestamp,
    smallint,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    is_subscribed: boolean("is_subscribed").default(false).notNull(),
    is_verified: boolean("is_verified").default(false).notNull(),
    credits: smallint("credits").default(0).notNull(),
    updated_at: timestamp({ precision: 6, withTimezone: true }),
    created_at: timestamp({ precision: 6, withTimezone: true })
        .defaultNow()
        .notNull(),
});
