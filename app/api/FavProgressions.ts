import axios from 'axios';
import { FavProgression } from '../_interfaces/FavProgression';


const api = axios.create({
  baseURL : '/api',
});


export const findAllFavProgression = async (): Promise<FavProgression[]> => {
  try{
    const response = await api.get<FavProgression[]>('/favProgressions');
    return response.data;
  }catch(error){
    if (axios.isAxiosError(error)){
      console.error(error)
      console.error('APIリクエストエラー:',error.response?.data);
      throw new Error('コード進行の取得に失敗しました')
    }
    throw error;
  }
}

export const createFavProgression = async (favProgression : FavProgression): Promise<FavProgression> => {
  try {
    const response = await api.post('/favProgressions/insert', favProgression);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('APIリクエストエラー:', error.response?.data);
      const messages = error.response?.data?.messages;
      throw new Error(messages ? messages.join(', ') : 'コード進行の登録に失敗しました');
    }
    throw error;
  }
};