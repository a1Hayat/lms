export type session = {
    id: number;
    name: string;
    level: string;
    type: string;
    location: string;
    date: string;
}

export const data: session[] = [
  {
    id: 1,
    name: "Intro to Data Structures",
    level: "O Level | IGCSE",
    type: "Physical",
    location: "CSWithBari - Lahore Campus",
    date: "2025-11-10",
  },
  {
    id: 2,
    name: "Object-Oriented Programming Workshop",
    level: "AS Level | A-1",
    type: "Online",
    location: "CSWithBari - Karachi Campus",
    date: "2025-11-15",
  },
  {
    id: 3,
    name: "Advanced Algorithms & Problem Solving",
    level: "AS Level | A-1",
    type: "Physical",
    location: "CSWithBari - Islamabad Campus",
    date: "2025-11-18",
  },
  {
    id: 4,
    name: "Database Design & SQL Practice",
    level: "A Level | A-2",
    type: "Physical",
    location: "CSWithBari - Lahore Campus",
    date: "2025-11-22",
  },
  {
    id: 5,
    name: "Web Development Bootcamp",
    level: "O Level | IGCSE",
    type: "Physical",
    location: "CSWithBari - Karachi Campus",
    date: "2025-11-28",
  },
];