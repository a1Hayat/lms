// types/courses.ts

export type lesson = {
  id: number;
  title: string;
  length: string; // or "length", depending on your DB field
  video_path: string;
   duration: number; // in seconds
};

export type courses = {
  id: number;
  title: string;
  level: string;
  description: string;
  thumbnail: string;
  price: number;
  instructor_id: number;
  created_at: string;

  // ✅ Add this (optional)
  curriculum?: lesson[];
};


export type lessons = {
    id: number;
    course_id: number;
    title: string;
    length: string;
    video_path: string;
    order_index: string;
    created_at: string;
}

export type lesson_count= {
    id: number;
    course_id: number;
}
