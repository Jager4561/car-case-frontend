export interface Post {
  id: number;
  status: 'published' | 'draft';
  date_created: string;
  date_updated: string;
  title: string;
  abstract: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  model: SelectedModel;
  comments: PostComment[];
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface DetailedPost extends Post {
  content: {
    type: 'text' | 'image';
    size?: number;
    content: string;
    file?: string;
  }[];
}

export interface SelectedModel {
  id: number,
  name: string,
  brand: {
    id: number,
    name: string,
    logo: string,
  },
  generation: {
    id: number,
    name: string,
    image: string,
  },
  hull_type: {
    id: number,
    name: string, 
  },
  engine: {
    id: number,
    name: string,
    capacity: number,
    horse_power: number,
    fuel: {
      id: number,
      name: string,
      color: string,
    }
  }
}

export interface PostComment {
  id: number;
  status: 'published' | 'deleted' | 'blocked';
  date_created: string;
  date_updated: string | null;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: string;
  likes?: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isUserComment?: boolean;
  children?: PostComment[];
}

export interface AddPostPayload {
  status: string;
  title: string;
  brand: number;
  model: number;
  generation: number;
  hull_type: number;
  engine: number;
  abstract: string;
  sections: {
    type: 'text' | 'image';
    size?: number;
    content: string | null;
    file?: File | null;
  }[];
}