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
    image?: string;
    owner: number;
    songs: number[];
  }

  export interface GenResType {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    owner: number;
    songs: number[];
  }

  export interface PlayListType {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    public: boolean;
    owner: number;
    entries: number[];
  }

  export interface PlayListEntry {
    id: number;
    created_at: string;
    updated_at: string;
    order: number;
    playlist: number;
    song: number;
    owner: number;
  }

  export interface GenResType {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    owner: number;
    songs: number[];
  }