import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const uploadDir = path.join(process.cwd(), "secure_uploads", "lessons")
    const uploadPath = path.join(uploadDir, filename)

    await writeFile(uploadPath, buffer)

    // Return a relative URL (Next.js serves /public as /)
    const fileUrl = `/secure_uploads/lessons/${filename}`

    return new Response(JSON.stringify({ url: fileUrl }), { status: 200 })
  } catch (error) {
    console.error("Upload failed:", error)
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 })
  }
}


