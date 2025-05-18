import api from './api';
import qs from 'qs'; // Install with: npm install qs

export interface MangaRequestDTO {
  title: string;
  author: string;
  description: string;
  overview: string;
  genres: string[];
  poster: File | Blob;
  background: File | Blob;
  userId: number;
}

export interface MangaItem {
  id: number;
  title: string;
  overview: string;
  description: string;
  author: string;
  posterUrl: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
  chapters: any[]; // You can define a more specific type if needed
  genres: string[];
}

export const createManga = async (payload: MangaRequestDTO) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('author', payload.author);
  formData.append('description', payload.description);
  formData.append('overview', payload.overview);
  formData.append('userId', payload.userId.toString());
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

export const getAllManga = async (
  offset: number,
  limit: number,
  sortby: string,
  isAsc: boolean,
) => {
  const response = await api.get('/manga', {
    params: { offset, limit, sortby, isAsc },
  });
  return response.data;
};

export interface SearchMangaDTO {
  title?: string;
  author?: string;
  genres?: string[];
  status?: string[];
  uploadedBy?: number;
}


export const searchManga = async (
  query: SearchMangaDTO,
  offset: number,
  limit: number,
) => {
  const params: Record<string, any> = {
    offset,
    limit,
  };

  if (query.title?.trim()) {
    params.title = query.title.trim();
  }

  if (query.author?.trim()) {
    params.author = query.author.trim();
  }

  if (Array.isArray(query.genres) && query.genres.length > 0) {
    params.genres = query.genres;
  }

  if (Array.isArray(query.status) && query.status.length > 0) {
    params.status = query.status;
  }

  if (query.uploadedBy) {
    params.uploadedBy = query.uploadedBy;
  }

  console.log('Checking params:', params);

  const response = await api.get('/manga/search', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  return response.data;
};

export const updateManga = async (id: number, payload: MangaRequestDTO) => {
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

  const response = await api.put(`/manga/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteManga = async (id: number) => {
  const response = await api.delete(`/manga/delete/${id}`);
  return response.data;
};

export const handleViewManga = async (id: number) => {
  const response = await api.put(`/manga/${id}/read`);
  return response.data;
};