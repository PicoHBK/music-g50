import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { useAlbums } from "@/hooks/useAlbums";
import { useArtists } from "@/hooks/useArtists";
import { useAuthContext } from "@/hooks/useAuth";
import { useGenRes } from "@/hooks/useGenRes";
import { SongsType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  title: string;
  year: number;
  duration: number;
  song_file: File | null;
  album: number | null;
  artist: number[];
  genre: number[] | null;
}

const postSong = (formData: FormData) => {
  const token = localStorage.getItem("token");
  const data = new FormData();

  data.append("title", formData.title);
  data.append("year", formData.year.toString());
  data.append("duration", formData.duration.toString());
  formData.album && data.append("album", formData.album.toString());
  if (formData.song_file) {
    data.append("song_file", formData.song_file);
  }

  return apiHarmSongPrivate
    .post<SongsType>("/harmonyhub/songs/", data, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      formData.artist.forEach((id_artist) => {apiHarmSongPrivate.post("/harmonyhub/song-artists/", {
        role: "Vocalista",
        song: response.data.id,
        artist: id_artist
      },{
        headers: {
          Authorization: `Token ${token}`,
        },
      });})

      formData.genre?.forEach((id_genre)=>{apiHarmSongPrivate.post("/harmonyhub/song-genres/", {
        song: response.data.id,
        genre: id_genre
      },{
        headers: {
          Authorization: `Token ${token}`,
        },
      });}
)

      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const SongForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    year: 0,
    duration: 0,
    song_file: null,
    album: null,
    artist: [],
    genre: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { state } = useAuthContext();

  const { mutate, isSuccess } = useMutation({
    mutationFn: postSong,
    onMutate: () => {
      console.log("Mandando la song");
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log("ON SUCCESS SONG");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      if (data.code === "ERR_BAD_REQUEST") {
        setMessage("Algo salio mal");
      }
      setLoading(false);
    },
  });

  const {data: albums } = useAlbums();
  const {data:artists } = useArtists();
  const {data:genres} = useGenRes()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        setFormData({ ...formData, [name]: target.files[0] });
      }
    } else if (type === "select-multiple") {
      const target = e.target as HTMLSelectElement;
      const values = Array.from(target.selectedOptions, option => Number(option.value));
      setFormData({ ...formData, [name]: values });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setMessage("");
  };

  const submitForm = (e: FormEvent): void => {
    e.preventDefault();
    console.log(formData);
    if(formData.title.length > 0){
      mutate(formData);
    }else{
      setMessage("El título es obligatorio")
    }
   
  };

  return (
    <>
      {!isSuccess ? (
        <form
          onSubmit={submitForm}
          className="flex flex-col font-lato gap-3 items-center text-mydark-100"
          encType="multipart/form-data"
        >
          <input
            name="title"
            type="text"
            maxLength={50}
            placeholder="Titulo"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="year"
            type="number"
            max={2147483647}
            placeholder="Año"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="duration"
            type="number"
            max={2147483647}
            placeholder="Duracion?"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="song_file"
            type="file"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            placeholder="File"
            onChange={handleChange}
            disabled={loading}
          />

          <select
            name="artist"
            className=" px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
            multiple
          >
            {artists
              ?.filter((artist) => artist.owner === state.user?.user__id)
              .map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
          </select>

          <select
            name="album"
            className=" px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          >
            <option value={""}>Sin Album</option>
            {albums
              ?.filter((album) => album.owner === state.user?.user__id)
              .map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
          </select>

          <select
            name="genre"
            className=" px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
            multiple
          >
            {genres
              ?.filter((genre) => genre.owner === state.user?.user__id)
              .map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
          </select>

          {!loading ? (
            <button
              type="submit"
              className="inline bg-myprim-600 text-myprim-200 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Agregar
            </button>
          ) : (
            <div className="w-10 h-10">
              <img
                src="https://img.icons8.com/?size=100&id=ldCN5cWRfXQ5&format=png&color=000000"
                alt="loading"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {message && (
            <p className="text-md text-myerror-500 font-bold">{message}</p>
          )}
        </form>
      ) : (
        <p className="text-mysuccess-500 bg-mysuccess-100 p-2 rounded-lg text-center font-semibold text-lg">Canción creada con éxito</p>
      )}
    </>
  );
};

export default SongForm;
