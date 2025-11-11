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
    const { id, type, name, email, phone } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ message: "Missing required data" }, { status: 400 });
    }

    // ✅ Validate type
    if (!["course", "resource", "bundle"].includes(type)) {
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

    // ✅ Fetch price depending on type
    let price = 0;

    if (type === "course") {
      const [rows]: any = await conn.execute(
        "SELECT price FROM courses WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Course not found" }, { status: 404 });

      price = Number(rows[0].price);
    }

    if (type === "resource") {
      const [rows]: any = await conn.execute(
        "SELECT price FROM resources WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Resource not found" }, { status: 404 });

      price = Number(rows[0].price);
    }

    if (type === "bundle") {
      const [rows]: any = await conn.execute(
        "SELECT discount_price FROM bundles WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Bundle not found" }, { status: 404 });

      price = Number(rows[0].discount_price);
    }

    // ✅ Create order (payment gateway will update status later)
    const [orderResult]: any = await conn.execute(
      `INSERT INTO orders (user_id, total_amount, discount_amount, final_amount, payment_method, payment_status)
       VALUES (?, ?, 0, ?, 'cash', 'pending')`,
      [userId, price, price]
    );

    const orderId = orderResult.insertId;

    // ✅ Insert into order_items
    await conn.execute(
      `INSERT INTO order_items (order_id, course_id, resource_id, price)
      VALUES (?, ?, ?, ?)`,
      [
        orderId,
        type === "course" ? id : null,
        type === "resource" ? id : null,
        price,
      ]
    );


    return NextResponse.json({
      success: true,
      message: "Order created successfully. Proceed to payment.",
      orderId,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  } finally {
    conn.end();
  }
}
