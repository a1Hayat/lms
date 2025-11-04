import React from "react";
import CourseCard from "./courseCard";
import { courses } from "../../types/courses";

type CourseGridProps = {
  courses: courses[];
  columns?: number; // optional, but you can keep it for future flexibility
  showInstructor?: boolean;
  onCardClick?: (course: courses) => void;
};

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  showInstructor = false,
  onCardClick,
}) => {
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
      "
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          showInstructor={showInstructor}
          onClick={() => onCardClick && onCardClick(course)}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
