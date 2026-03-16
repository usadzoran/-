export type UserRole = 'student' | 'teacher' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended';

export interface UserProfile {
  id: string;
  auth_id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  account_status: AccountStatus;
  profile_image?: string;
  bio?: string;
  rating?: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  author?: UserProfile;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: UserProfile;
}

export interface LiveClass {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  description?: string;
  start_time: string;
  status: 'upcoming' | 'live' | 'ended';
  meeting_link?: string;
  max_students: number;
  current_students: number;
  teacher?: UserProfile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
}

export interface Subscription {
  id: string;
  student_id: string;
  teacher_id: string;
  subject: string;
  status: 'active' | 'expired';
  created_at: string;
}

export interface LessonFile {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface ExplainVideo {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  video_url: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'message' | 'content' | 'live' | 'system';
  is_read: boolean;
  created_at: string;
}
