import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { ResultSetHeader } from "mysql2"

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
    // FIX: Use <ResultSetHeader> generic instead of :any
    const [courseResult] = await db.execute<ResultSetHeader>(
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