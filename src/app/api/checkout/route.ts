import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

export async function POST(req: Request) {
  const conn = await db();

  try {
    const { name, email, phone, id, type } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ message: "Missing course/resource data" }, { status: 400 });
    }

    if (!["course", "resource"].includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    // ✅ Check if user exists or create new
    const [userRows]: any = await conn.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    let userId: number;

    if (userRows.length > 0) {
      userId = userRows[0].id;
    } else {
      const [newUser]: any = await conn.execute(
        "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
        [name, email, phone]
      );
      userId = newUser.insertId;
    }

    // ✅ Fetch Price
    const table = type === "course" ? "courses" : "resources";
    const [itemRows]: any = await conn.execute(
      `SELECT price FROM ${table} WHERE id = ? LIMIT 1`,
      [id]
    );

    if (itemRows.length === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const price = Number(itemRows[0].price);

    // ✅ Create Order
    const [orderResult]: any = await conn.execute(
      `INSERT INTO orders (user_id, total_amount, discount_amount, final_amount, payment_method, payment_status)
      VALUES (?, ?, 0, ?, 'cash', 'pending')`,
      [userId, price, price]
    );

    const orderId = orderResult.insertId;

    // ✅ Create Order Item
    await conn.execute(
      `INSERT INTO order_items (order_id, course_id, resource_id, price)
       VALUES (?, ?, ?, ?)`,
      [
        orderId,
        type === "course" ? id : null,
        type === "resource" ? id : null,
        price
      ]
    );

    return NextResponse.json({
      message: "Order placed successfully. Pay cash to activate.",
      orderId
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}
