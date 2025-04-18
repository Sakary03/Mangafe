// mangaChapter.ts
import api from './api';

export interface MangaChapterDTO {
  pages: string[];
}

export interface ChapterResponse {
  id: number;
  chapterIndex: number;
  pages: string[];
  readTimes: number;
  createdAt: string;
  updatedAt: string;
} 

export const getChapter = async (mangaId: number, chapterIndex: number) => {
  const response = await api.get(
    `/chapter/${mangaId}/get-chapter/${chapterIndex}`,
  );
  const chapterInfo = response.data as ChapterResponse;
  return chapterInfo;
};

export const getAllChapter = async (mangaId: number) => {
  const response = await api.get(`/chapter/${mangaId}`);
  const chapterList = response.data as ChapterResponse[];
  return chapterList;
};

export const addChapter = async (
  mangaId: number,
  chapterIndex: number,
  chapterData: MangaChapterDTO,
) => {
  const response = await api.post(
    `/chapter/${mangaId}/add-chapter?chapter_index=${chapterIndex}`,
    chapterData,
  );
  return response.data;
};

export const updateChapter = async (
  mangaId: number,
  chapterIndex: number,
  chapterData: MangaChapterDTO,
) => {
  const response = await api.put(
    `/chapter/${mangaId}/update-chapter/${chapterIndex}`,
    chapterData,
  );
  return response.data;
};

export const deleteChapter = async (mangaId: number, chapterIndex: number) => {
  const response = await api.delete(
    `/chapter/${mangaId}/update-chapter/${chapterIndex}`,
  );
  return response.data;
};
