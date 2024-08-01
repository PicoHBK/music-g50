export interface PagSongType {
  count: number;
  next: null | string;
  previous: null |string;
  results : SongsType[]
}
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
  

  export interface PagAlbumType {
    count: number;
    next: null | string;
    previous: null |string;
    results : AlbumType[]
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

  export interface PagArtistType {
    count: number;
    next: null | string;
    previous: null |string;
    results : ArtistType[]

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

  export interface PagPlayListType {
    count: number;
    next: null | string;
    previous: null | string;
    results : PlayListType[]
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
  export interface PagPlayListEntry {
    count: number;
    next: null | string;
    previous: null | string;
    results : PlayListEntry
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

  export interface PagGenResType {
    count: number;
    next: null | string;
    previous: null | string;
    results : GenResType[]
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