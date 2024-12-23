import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { videos } from "./videos";

export const comments = pgTable("comments", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),

    description: text("description").notNull(),
    commented_by: text("commented_by")
        .references(() => users.id)
        .notNull(),
    video: text("video")
        .references(() => videos.id)
        .notNull(),
    created_at: timestamp({ precision: 6, withTimezone: true })
        .defaultNow()
        .notNull(),
});