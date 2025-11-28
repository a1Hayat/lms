import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// --- Types ---
interface UserRow extends RowDataPacket {
  id: number;
}

interface PriceRow extends RowDataPacket {
  price: number;
}

interface BundlePriceRow extends RowDataPacket {
  discount_price: number;
}

export async function POST(req: Request) {
  try {
    const { id, type, name, email, phone, paymentMethod } = await req.json();

    if (!id || !type) {
      return NextResponse.json(
        { message: "Missing required data" },
        { status: 400 }
      );
    }

    if (!["course", "resource", "bundle"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid item type" },
        { status: 400 }
      );
    }

    // --- Check if user exists ---
    const [userRows] = await db.execute<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    let userId: number;

    if (userRows.length > 0) {
      userId = userRows[0].id;
    } else {
      const [newUser] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
        [name, email, phone]
      );
      userId = newUser.insertId;
    }

    // --- Fetch Price ---
    let price = 0;

    if (type === "course") {
      const [rows] = await db.execute<PriceRow[]>(
        "SELECT price FROM courses WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Course not found" }, { status: 404 });
      price = Number(rows[0].price);
    }

    if (type === "resource") {
      const [rows] = await db.execute<PriceRow[]>(
        "SELECT price FROM resources WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length)
        return NextResponse.json({ message: "Resource not found" }, { status: 404 });
      price = Number(rows[0].price);
    }

    if (type === "bundle") {
      const [rows] = await db.execute<BundlePriceRow[]>(
        "SELECT discount_price FROM bundles WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length)
        return NextResponse.json({ message: "Bundle not found" }, { status: 404 });

      price = Number(rows[0].discount_price);
    }

    // --- Create Order ---
    const [orderResult] = await db.execute<ResultSetHeader>(
      `INSERT INTO orders 
        (user_id, total_amount, discount_amount, final_amount, payment_method, payment_status)
       VALUES (?, ?, 0, ?, ?, 'pending')`,
      [userId, price, price, paymentMethod]
    );

    const orderId = orderResult.insertId;

    // --- Create Order Item ---
    await db.execute(
      `INSERT INTO order_items (order_id, course_id, resource_id, bundle_id, price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId,
        type === "course" ? id : null,
        type === "resource" ? id : null,
        type === "bundle" ? id : null,
        price,
      ]
    );

    return NextResponse.json({
      message: "Order placed successfully. Pay cash to activate.",
      orderId,
      status: "success",
    });

  } catch (error) {
    console.error("ORDER API ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
