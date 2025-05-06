export interface Manga {
  id: number;
  title: string;
  overview: string;
  description: string;
  author: string;
  posterUrl: string;
  backgroundUrl: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  chapters: any[]; // You can define a `Chapter` interface if needed
  genres: string[]; // You can also use a union type if genres are fixed
}
