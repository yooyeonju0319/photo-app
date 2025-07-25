export interface User {
  id: string;
  username: string;
  profilePic: string;
  question: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  uploader: string;
  url: string;
  title: string;
  tags: string;
  description: string;
  likes: string[];
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}