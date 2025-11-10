import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customPricingOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  actualPrice: z.number(),
  sellingPrice: z.number(),
  inStock: z.boolean(),
});

export type CustomPricingOption = z.infer<typeof customPricingOptionSchema>;

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export type FAQ = z.infer<typeof faqSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  keyFeatures: text("key_features").notNull().default(""),
  productDescription: text("product_description").default(""),
  price1MonthActual: integer("price_1_month_actual").notNull(),
  price1MonthSelling: integer("price_1_month_selling").notNull(),
  inStock1Month: boolean("in_stock_1_month").notNull().default(true),
  price3MonthActual: integer("price_3_month_actual").notNull(),
  price3MonthSelling: integer("price_3_month_selling").notNull(),
  inStock3Month: boolean("in_stock_3_month").notNull().default(true),
  price6MonthActual: integer("price_6_month_actual").notNull(),
  price6MonthSelling: integer("price_6_month_selling").notNull(),
  inStock6Month: boolean("in_stock_6_month").notNull().default(true),
  price12MonthActual: integer("price_12_month_actual").notNull(),
  price12MonthSelling: integer("price_12_month_selling").notNull(),
  inStock12Month: boolean("in_stock_12_month").notNull().default(true),
  customOptions: jsonb("custom_options").$type<CustomPricingOption[]>().default(sql`'[]'::jsonb`),
  faqs: jsonb("faqs").$type<FAQ[]>().default(sql`'[]'::jsonb`),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
