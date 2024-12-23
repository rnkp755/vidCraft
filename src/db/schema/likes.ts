import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { videos } from "./videos";

export const likes = pgTable("likes", {
    id: uuid("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),

    liked_by: text("liked_by")
        .references(() => users.id)
        .notNull(),
    video: uuid("video")
        .references(() => videos.id)
        .notNull(),
    created_at: timestamp({ precision: 6, withTimezone: true })
        .defaultNow()
        .notNull(),
});
