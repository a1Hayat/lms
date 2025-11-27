import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// 1. Define Database Row Types
interface UserRow extends RowDataPacket {
  id: number;
}

interface PriceRow extends RowDataPacket {
  price: number;
}

interface BundlePriceRow extends RowDataPacket {
  discount_price: number;
}

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
    const { id, type, name, email, phone, paymentMethod } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ message: "Missing required data" }, { status: 400 });
    }

    // ✅ Validate type - Now accepts all three
    if (!["course", "resource", "bundle"].includes(type)) {
      return NextResponse.json({ message: "Invalid item type" }, { status: 400 });
    }

    // ✅ Check if user exists or create new
    // FIX: Use <UserRow[]> generic
    const [userRows] = await conn.execute<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    let userId: number;

    if (userRows.length > 0) {
      userId = userRows[0].id;
    } else {
      // FIX: Use <ResultSetHeader> for INSERTs
      const [newUser] = await conn.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
        [name, email, phone]
      );
      userId = newUser.insertId;
    }

    // ✅ Fetch price depending on type
    let price = 0;

    if (type === "course") {
      // FIX: Use <PriceRow[]> generic
      const [rows] = await conn.execute<PriceRow[]>(
        "SELECT price FROM courses WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Course not found" }, { status: 404 });
      price = Number(rows[0].price);
    } 
    
    if (type === "resource") {
      // FIX: Use <PriceRow[]> generic
      const [rows] = await conn.execute<PriceRow[]>(
        "SELECT price FROM resources WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Resource not found" }, { status: 404 });
      price = Number(rows[0].price);
    } 
    
    if (type === "bundle") {
      // FIX: Use <BundlePriceRow[]> generic
      const [rows] = await conn.execute<BundlePriceRow[]>(
        "SELECT discount_price FROM bundles WHERE id = ? LIMIT 1",
        [id]
      );
      if (!rows.length) return NextResponse.json({ message: "Bundle not found" }, { status: 404 });
      price = Number(rows[0].discount_price);
    }

    // ✅ Create order
    // FIX: Use <ResultSetHeader> generic
    const [orderResult] = await conn.execute<ResultSetHeader>(
      `INSERT INTO orders (user_id, total_amount, discount_amount, final_amount, payment_method, payment_status)
       VALUES (?, ?, 0, ?, ?, 'pending')`,
      [userId, price, price, paymentMethod]
    );

    const orderId = orderResult.insertId;

    // ✅ Create Order Item - Dynamically adds the correct ID
    await conn.execute(
      `INSERT INTO order_items (order_id, course_id, resource_id, bundle_id, price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId,
        type === "course" ? id : null,
        type === "resource" ? id : null,
        type === "bundle" ? id : null,
        price
      ]
    );

    return NextResponse.json({
      message: "Order placed successfully. Pay cash to activate.",
      orderId,
      status:'success'
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    conn.end();
  }
}