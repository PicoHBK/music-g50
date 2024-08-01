import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { GenResType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  name: string;
  description: string;
}

const postGenRes = (formData: FormData) => {
  const token = localStorage.getItem("token");

  return apiHarmSongPrivate
    .post<GenResType>("/harmonyhub/genres/", formData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};
function GenResForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isSuccess } = useMutation({
    mutationFn: postGenRes,
    onMutate: () => {
      console.log("Mandando el GenRes");
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log("ON SUCCESS Gen");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["genres-infinity"] });
      if (data.code === "ERR_BAD_REQUEST") {
        setMessage("Algo salio mal");
      }
      setLoading(false);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setMessage("");
  };

  const submitForm = (e: FormEvent): void => {
    e.preventDefault();
    console.log(formData);
    if (formData.name.length > 0 && formData.description.length > 0) {
      mutate(formData);
    } else {
      setMessage("Por favor ponga un titulo y descripción validos");
    }
  };

  return (
    <>
      {!isSuccess ? (
        <form
          onSubmit={submitForm}
          className="flex flex-col font-lato gap-3 items-start text-mydark-100"
          encType="multipart/form-data"
        >
          <input
            name="name"
            type="text"
            value={formData.name}
            maxLength={50}
            placeholder="Título"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          <textarea
            name="description"
            rows={4}
            cols={50}
            placeholder="Descripción"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          {!loading ? (
            <button
              type="submit"
              className="inline bg-mywarn-500 text-mywarn-100 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Crear Genero
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
        <p className="text-mysuccess-600 bg-mysuccess-200 p-2 rounded-lg text-center font-semibold text-lg">
          Genero creado con éxito
        </p>
      )}
    </>
  );
}

export default GenResForm;
