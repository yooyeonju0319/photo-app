import { supabase } from '../lib/supabase';
import { User, Photo } from '../types';

// ✅ 회원가입 함수
export const createUser = async (userData: {
  username: string;
  password: string;
  question: string;
  answer: string;
}): Promise<User | null> => {
  try {
    const profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;

    const { data, error } = await supabase.from('users').insert([
      {
        username: userData.username,
        password: userData.password,
        question: userData.question,
        answer: userData.answer,
        profilepic: profilePic, // ✅ 컬럼명 일치
      }
    ]).select().single();

    if (error) {
      console.error('User creation error:', error.message);
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      profilePic: data.profilepic,
      question: data.question,
      createdAt: '' // users 테이블에 created_at이 없으므로 빈 값
    };
  } catch (err) {
    console.error('Unexpected error creating user:', err);
    return null;
  }
};

// ✅ 사용자 찾기
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error finding user:', error.message);
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    profilePic: data.profilepic,
    question: data.question,
    createdAt: ''
  };
};

// ✅ 로그인 정보 검증
export const validateUserCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) {
    console.error('Invalid credentials:', error.message);
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    profilePic: data.profilepic,
    question: data.question,
    createdAt: ''
  };
};

// ✅ 보안 질문 복구
export const recoverUserAccount = async (
  username: string,
  answer: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('answer', answer)
    .single();

  if (error) {
    console.error('Recovery failed:', error.message);
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    profilePic: data.profilepic,
    question: data.question,
    createdAt: ''
  };
};

// ✅ 사진 생성 (Storage에서 url 받아온 후 DB에 저장)
export const createPhoto = async (photoData: {
  uploader: string;
  url: string;
  title: string;
  tags: string;
  description: string;
}): Promise<Photo | null> => {
  const { data, error } = await supabase.from('photos').insert([
    {
      uploader: photoData.uploader,
      url: photoData.url,
      title: photoData.title,
      tags: photoData.tags,
      description: photoData.description,
      likes: [],
      created_at: new Date().toISOString()
    }
  ]).select().single();

  if (error) {
    console.error('Error saving photo:', error.message);
    return null;
  }

  return data;
};

// ✅ 전체 사진 가져오기
export const getAllPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error.message);
    return [];
  }

  return data;
};

// ✅ 좋아요 업데이트
export const updatePhotoLikes = async (
  photoId: string,
  likes: string[]
): Promise<boolean> => {
  const { error } = await supabase
    .from('photos')
    .update({ likes })
    .eq('id', photoId);

  if (error) {
    console.error('Error updating likes:', error.message);
    return false;
  }

  return true;
};
