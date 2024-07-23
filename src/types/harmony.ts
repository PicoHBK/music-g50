export interface SongsType{
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    year?: number;
    duration?: number;
    song_file?: string;
    album?: number;
    owner: number;
    artists: any[];
    genres: any[];
  }