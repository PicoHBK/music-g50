import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { useAlbums } from "@/hooks/useAlbums";
import { useAuthContext } from "@/hooks/useAuth";
import { SongsType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
    id: number;
    title: string;
    year: number;
    duration: number;
    song_file: File | null;
    album: number | null;
  }

const putSong = (formData: FormData) => {
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
    .put<SongsType>(`/harmonyhub/songs/${formData.id}`, data, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
        
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

function SongEdit({ song }: { song: SongsType }) {
  const [formData, setFormData] = useState<FormData>({
    id: song.id,
    title: song.title,
    year: song.year || 0,
    duration: song.duration || 0,
    song_file: null,
    album: song.album || null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { state } = useAuthContext();

  const { mutate, isSuccess } = useMutation({
    mutationFn: putSong,
    onMutate: () => {
      console.log("Mandando la song");
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

  const { data: albums } = useAlbums();

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
    setLoading(true);
    mutate(formData);
  };

  return (
    <>
      {!isSuccess ? (
        <form
          onSubmit={submitForm}
          className="flex flex-col font-lato gap-3 items-center text-mydark-100"
          encType="multipart/form-data"
        >
          <label
            htmlFor="title"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            maxLength={50}
            placeholder="Título"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          <label
            htmlFor="year"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Año
          </label>
          <input
            id="year"
            name="year"
            type="number"
            max={2147483647}
            value={formData.year}
            placeholder="Año"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          <label
            htmlFor="duration"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Duración
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            max={2147483647}
            placeholder="Duración"
            value={formData.duration}
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          <label
            htmlFor="album"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Álbum
          </label>
          <select
            id="album"
            name="album"
            className="px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          >
            <option
              value={albums?.find((Album) => Album.id === song.album)?.id}
            >
              {albums?.find((Album) => Album.id === song.album)?.title}
            </option>
            {albums
              ?.filter((album) => album.owner === state.user?.user__id)
              .map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
          </select>

          <label
            htmlFor="song_file"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Archivo de Canción
          </label>
          <input
            id="song_file"
            name="song_file"
            type="file"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          {!loading ? (
            <button
              type="submit"
              className="inline bg-mywarn-500 text-mywarn-100 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Editar
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
        <p>Cargado</p>
      )}
    </>
  );
}

export default SongEdit;
