import api from './api';

export interface ReadingHistoryDTO {
  userId: number;
  mangaId?: number;
  chapterId?: number;
}

export interface ReadingHistoryResponse {
  id: number;
  user: {
    id: number;
    fullName: string;
    userName: string;
    email: string;
  };
  manga: {
    id: number;
    title: string;
    posterUrl: string;
  };
  chapter: {
    id: number;
    number: number;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const createReadingHistory = async (
  payload: ReadingHistoryDTO,
): Promise<ReadingHistoryResponse> => {
  const formData = new FormData();
  formData.append('userId', payload.userId.toString());

  if (payload.mangaId) {
    formData.append('mangaId', payload.mangaId.toString());
  }

  if (payload.chapterId) {
    formData.append('chapterId', payload.chapterId.toString());
  }

  const response = await api.post('/history', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getUserReadingHistory = async (
  userId: number,
  mangaId?: number,
): Promise<ReadingHistoryResponse[]> => {
  const formData = new FormData();
  formData.append('userId', userId.toString());

  if (mangaId) {
    formData.append('mangaId', mangaId.toString());
  }

  const response = await api.get('/history', {
    params: { userId, mangaId },
  });

  return response.data;
};

export const getMangaReadingHistory = async (
  userId: number,
  mangaId: number,
): Promise<ReadingHistoryResponse[]> => {
  return getUserReadingHistory(userId, mangaId);
};

export const recordChapterRead = async (
  userId: number,
  mangaId: number,
  chapterId: number,
): Promise<ReadingHistoryResponse> => {
  console.log('Recording chapter read:', { userId, mangaId, chapterId });
  return createReadingHistory({
    userId,
    mangaId,
    chapterId,
  });
};
