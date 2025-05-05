/* eslint-disable @typescript-eslint/no-unused-vars */
// mangaChapter.ts
import { RcFile } from 'antd/es/upload';
import api from './api';

export interface MangaChapterDTO {
  pages: RcFile[];
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
  formData: FormData,
) => {
  const response = await api.post(
    `/chapter/${mangaId}/add-chapter`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const updateChapter = async (
  mangaId: number,
  chapterIndex: number,
  formData: FormData,
) => {
  const response = await api.put(
    `/chapter/${mangaId}/update-chapter/${chapterIndex}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteChapter = async (mangaId: number, chapterIndex: number) => {
  const response = await api.delete(
    `/chapter/${mangaId}/update-chapter/${chapterIndex}`,
  );
  return response.data;
};

export interface ChapterResponse {
  id: number;
  chapterIndex: number;
  pages: string[];
  title: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: ChapterResponse[];
  total: number;
  page: number;
  limit: number;
}

export const getAllChaptersPaginated = async (
  offset: number = 0,
  limit: number = 10,
  sortField: string = 'createdAt'
): Promise<PaginatedResponse> => {
  const response = await api.get('/chapter/get-all', {
    params: {
      offset,
      limit,
      sortField
    }
  });
  
  if (Array.isArray(response.data)) {
    return {
      data: response.data as ChapterResponse[],
      total: response.data.length, // This would be better if the backend provided a total count
      page: Math.floor(offset / limit) + 1,
      limit
    };
  }
  
  return response.data as PaginatedResponse;
};

export const getChapterById = async (chapterId: number): Promise<ChapterResponse> => {
  const response = await api.get(`/chapter/${chapterId}`);
  return response.data as ChapterResponse;
};


export const getAllChaptersForStats = async (
  offset: number = 0,
  limit: number = 10000,
  sortField: string = 'createdAt'
): Promise<PaginatedResponse> => {
  const response = await api.get('/chapter/get-all', {
    params: {
      offset,
      limit,
      sortField
    }
  });
  
  if (Array.isArray(response.data)) {
    return {
      data: response.data as ChapterResponse[],
      total: response.data.length, // This would be better if the backend provided a total count
      page: Math.floor(offset / limit) + 1,
      limit
    };
  }
  
  return response.data as PaginatedResponse;
};