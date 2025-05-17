import { usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm"; // ✅ You forgot to import this

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing name or email" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (users.length === 0) {
      // Insert new user
      const result = await db
        .insert(usersTable)
        .values({ name, email })
        .returning();

      console.log("New user created:", result[0]);
      return NextResponse.json(result[0], { status: 201 });
    }

    console.log("User already exists:", users[0]);
    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
