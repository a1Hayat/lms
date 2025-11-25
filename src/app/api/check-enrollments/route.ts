import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, course_id, resource_id } = await req.json();

    if (!user_id || (!course_id && !resource_id)) {
      return NextResponse.json(
        { success: false, message: "Missing params" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 1. CHECK COURSE (Direct Enrollment OR Valid Order OR Bundle Order)
    // ---------------------------------------------------------
    if (course_id) {
      // A. Check Active Enrollment
      const [enrollment] = await db.query(
        `SELECT id 
         FROM enrollments 
         WHERE user_id = ? 
           AND course_id = ? 
           AND status = 'active' 
         LIMIT 1`,
        [user_id, course_id]
      );

      if (Array.isArray(enrollment) && enrollment.length > 0) {
        return NextResponse.json({ purchased: true, type: "course", reason: "already_enrolled" });
      }

      // B. Check PAID Orders (Direct Course OR Bundle containing Course)
      // This query checks:
      // 1. Did they buy the course directly?
      // 2. OR Did they buy a bundle that contains this course?
      const [order] = await db.query(
        `SELECT oi.id 
         FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id
         LEFT JOIN bundle_items bi ON bi.bundle_id = oi.bundle_id
         WHERE o.user_id = ? 
           AND o.payment_status = 'paid' 
           AND (
             oi.course_id = ? 
             OR bi.course_id = ?
           )
         LIMIT 1`,
        [user_id, course_id, course_id]
      );

      if (Array.isArray(order) && order.length > 0) {
        return NextResponse.json({ purchased: true, type: "course", reason: "order_exists" });
      }
    }

    // ---------------------------------------------------------
    // 2. CHECK RESOURCE (Direct Enrollment OR Valid Order OR Bundle Order)
    // ---------------------------------------------------------
    if (resource_id) {
      // A. Check Active Enrollment
      const [enrollment] = await db.query(
        `SELECT id 
         FROM enrollments 
         WHERE user_id = ? 
           AND resource_id = ? 
           AND status = 'active'
         LIMIT 1`,
        [user_id, resource_id]
      );

      if (Array.isArray(enrollment) && enrollment.length > 0) {
        return NextResponse.json({ purchased: true, type: "resource", reason: "already_enrolled" });
      }

      // B. Check PAID Orders (Direct Resource OR Bundle containing Resource)
      const [order] = await db.query(
        `SELECT oi.id 
         FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id
         LEFT JOIN bundle_items bi ON bi.bundle_id = oi.bundle_id
         WHERE o.user_id = ? 
           AND o.payment_status = 'paid'
           AND (
             oi.resource_id = ? 
             OR bi.resource_id = ?
           )
         LIMIT 1`,
        [user_id, resource_id, resource_id]
      );

      if (Array.isArray(order) && order.length > 0) {
        return NextResponse.json({ purchased: true, type: "resource", reason: "order_exists" });
      }
    }

    return NextResponse.json({ purchased: false });

  } catch (error) {
    console.error("Purchase check error:", error);
    return NextResponse.json({ purchased: false, error: true });
  }
}