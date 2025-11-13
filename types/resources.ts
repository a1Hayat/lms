export type resources = {
  id: number;
  title: string;
  description?: string;
  price: number;
  level: "o-level" | "as-level" | "a-level";
  file_path: string;
  thumbnail?: string;
  created_at: string;
};
