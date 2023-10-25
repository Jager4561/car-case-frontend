export interface Post {
  id: string;
  date_created: string;
  date_updated: string;
  title: string;
  abstract: string;
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  model: SelectedModel;
  comments: PostComment[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
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
  id: string;
  date_created: string;
  date_updated: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isUserComment: boolean;
  children: ChildComment[];
}

export interface ChildComment { 
  id: string;
  date_created: string;
  date_updated: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  }
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isUserComment: boolean;
}