<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import fs from "fs";
// import path from "path";
// import { writeFile } from "fs/promises";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const price = formData.get("price") as string;
//     const instructor_id = formData.get("instructor_id") as string;
//     const file = formData.get("thumbnail") as File;

//     if (!title || !description || !price || !instructor_id || !file) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Save uploaded image
//     const uploadDir = path.join(process.cwd(), "public", "course_thumbnails");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const originalName = ((file as File & { name?: string }).name ?? "thumbnail.png");
//     const ext = path.extname(originalName) || ".png";
//     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//     const newFileName = `${timestamp}${ext}`;
//     const filePath = path.join(uploadDir, newFileName);

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     await writeFile(filePath, buffer);

//     const imagePath = `/course_thumbnails/${newFileName}`;

//     // Insert into DB
//     await db.query(
//       `
//       INSERT INTO courses (title, description, thumbnail, price, instructor_id)
//       VALUES (?, ?, ?, ?, ?)
//       `,
//       [title, description, imagePath, price, instructor_id]
//     );

//     return NextResponse.json({
//       message: "Course added successfully",
//       thumbnail: imagePath,
//     });
//   } catch (error) {
//     console.error("Course upload error:", error);
//     return NextResponse.json(
//       { error: "Failed to add course" },
//       { status: 500 }
//     );
//   }
// }


=======
>>>>>>> 6ad786e49aee854d19a6663a23e50c99a7d80348
import {db} from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user_id = session?.user?.id
    
    if (!user_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { title, description, price, level, thumbnailUrl, lessons } = await req.json()

    // ✅ Normalize all values
    const safeTitle = title || ""
    const safeDescription = description || ""
    const safePrice = Number(price) || 0
    const safeLevel = level || "o-level"
    const safeThumbnail = thumbnailUrl || null

    // ✅ Insert course
    const [courseResult]: any = await db.execute(
      `INSERT INTO courses (title, level, description, thumbnail, price, instructor_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [safeTitle, safeLevel, safeDescription, safeThumbnail, safePrice, user_id]
    )

    const courseId = courseResult.insertId

    // ✅ Insert lessons
    if (Array.isArray(lessons) && lessons.length > 0) {
      for (const [index, lesson] of lessons.entries()) {
        const title = lesson.name || `Lesson ${index + 1}`
        const content = lesson.duration || ""
        const videoPath = lesson.uploadedUrl || null

        await db.execute(
          `INSERT INTO lessons (course_id, title, length, video_path, order_index, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [courseId, title, content, videoPath, index + 1]
        )
      }
    }

    return new Response(
      JSON.stringify({ message: "Course created successfully", courseId }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Error creating course:", error)
    return new Response(
      JSON.stringify({ error: "Failed to create course" }),
      { status: 500 }
    )
  }
}
