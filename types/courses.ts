export type courses = {
    id: number;
    title: string;
    level: string;
    description: string;
    thumbnail:string;
    price: number;
    instructor_id: number;
    created_at: string;
} 

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
