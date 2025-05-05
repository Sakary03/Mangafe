import { RcFile } from 'antd/es/upload';
import axios from 'axios';
import { sha1 } from 'js-sha1';

type UploadResponse = {
  url: string;
  secure_url: string;
  public_id: string;
};

const CLOUD_NAME = 'djst6i5om';
const API_KEY = '639485751612965';
const API_SECRET = '0gYze-XsoUR-S9gatpZGGjSBC-E';

export const uploadToCloudinary = async (file: RcFile): Promise<UploadResponse> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `timestamp=${timestamp}${API_SECRET}`;
  const signature = sha1(paramsToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await axios.post(uploadUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
