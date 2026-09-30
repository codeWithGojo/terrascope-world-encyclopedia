import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
export const tripBriefs = sqliteTable("trip_briefs", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull(),
  destination:text("destination").notNull(), city:text("city").notNull().default(""),
  startDate:text("start_date").notNull(), endDate:text("end_date").notNull(),
  travelers:integer("travelers").notNull(), budgetMinor:integer("budget_minor").notNull(),
  currency:text("currency").notNull(), interests:text("interests").notNull(),
  notes:text("notes").notNull().default(""), itinerary:text("itinerary").notNull().default(""),
  createdAt:text("created_at").notNull(), updatedAt:text("updated_at").notNull(),
},table=>[index("idx_trip_briefs_owner_created").on(table.ownerId,table.createdAt)]);
