import api from './api';

export interface MangaRequestDTO {
  title: string;
  author: string;
  description: string;
  overview: string;
  genres: string[];
  posterUrl: string;
  backgroundUrl: string;
}

export interface CreateMangaPayload {
  title: string;
  author: string;
  description: string;
  overview: string;
  genres: string[];
  poster: File | Blob;
  background: File | Blob;
}

export const createManga = async (payload: CreateMangaPayload) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('author', payload.author);
  formData.append('description', payload.description);
  formData.append('overview', payload.overview);

  payload.genres.forEach(genre => {
    formData.append('genres', genre);
  });

  formData.append('poster', payload.poster);
  formData.append('background', payload.background);

  const response = await api.post('/manga', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getMangaById = async (id: number) => {
  const response = await api.get(`/manga/${id}`);
  return response.data;
};

export const getAllManga = async (offset: number, limit: number) => {
  const response = await api.get('/manga', {
    params: { offset, limit },
  });
  return response.data;
};

export interface SearchMangaDTO {
  keyword?: string;
  title?: string;
  author?: string;
  genres?: string;
}

export const searchManga = async (
  query: SearchMangaDTO,
  offset: number,
  limit: number,
) => {
  const response = await api.get('/manga/search', {
    params: { ...query, offset, limit },
  });
  return response.data;
};

export const updateManga = async (id: number, data: MangaRequestDTO) => {
  const response = await api.put(`/manga/update/${id}`, data);
  return response.data;
};

export const deleteManga = async (id: number) => {
  const response = await api.delete(`/manga/delete/${id}`);
  return response.data;
};
