import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
export const videos = pgTable("videos", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    title: text("title"),
    description: text("description"),
    thumbnail: text("thumbnail"),
    duration: text("duration"),
    views: integer("views"),
    source: text("source").notNull(),
    edits: text("edits").array(),
    owner: text("owner")
        .references(() => users.id)
        .notNull(),
    updated_at: timestamp({ precision: 6, withTimezone: true }),
    created_at: timestamp({ precision: 6, withTimezone: true })
        .defaultNow()
        .notNull(),
});
