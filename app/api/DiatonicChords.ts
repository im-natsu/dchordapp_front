import axios from 'axios';
import { DiatonicChord } from '../_interfaces/DiatonicChord';


const api = axios.create({
  baseURL : 'https://dchordapp-back-1.onrender.com/api',
});


export const findAllDiactonicChords = async (): Promise<DiatonicChord[]> => {
  try{
    const response = await api.get<DiatonicChord[]>('/chords');
    return response.data;
  }catch(error){
    if (axios.isAxiosError(error)){
      console.error(error)
      console.error('APIリクエストエラー:',error.response?.data);
      throw new Error('ツイートの取得に失敗しました')
    }
    throw error;
  }
}