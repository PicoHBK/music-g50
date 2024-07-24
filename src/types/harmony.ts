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

  export interface AlbumType {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    year?: number;
    cover?: string;
    artist: number;
    owner: number;
  }

  export interface ArtistType {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    bio?: string;
    website?: string;
    owner: number;
    songs: any[];
  }