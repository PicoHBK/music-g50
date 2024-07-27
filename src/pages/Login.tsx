import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import apiHarmSongPrivate from "../apis/privateHarmonySong";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";

interface EventFormData {
  username: string;
  password: string;
}

type ResLoginType = {
    key: string;
  };

const login = (formData: EventFormData) => {
    delete apiHarmSongPrivate.defaults.headers.common["Authorization"];
    return apiHarmSongPrivate
      .post<ResLoginType>("/api-auth/", formData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

function Login() {
  const {dispatch} = useAuthContext()
  const [formData, setFormData] = useState<EventFormData>({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: login,
    onMutate: () => {
      console.log("BORRANDO TOKEN");
      localStorage.removeItem("token");
    },
    onSuccess: (data) => {
      console.log("ON SUCCESS");
      console.log(JSON.stringify(data.code));
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch({type: "SET_AUTH", payload: true})
        navigate("/")
      }
      if(data.code === "ERR_BAD_REQUEST"){
        setMessage("Usuario o Contraseña Incorrecta")
      }
      setLoading(false);
    },
  });

  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage("");
  };

  const submitForm = (e: FormEvent): void => {
    e.preventDefault();
    console.log(formData)
    setLoading(true);
    mutate(formData)
  };


  

  return (
    <form onSubmit={submitForm} className="flex flex-col font-lato gap-3 items-center text-mydark-100">
      <input
        name="username"
        type="text"
        maxLength={25}
        placeholder="Usuario"
        className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
        onChange={handleChange}
        disabled={loading}
      />
      <input
        name="password"
        type="password"
        maxLength={25}
        placeholder="Contraseña"
        className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
        onChange={handleChange}
        disabled={loading}
      />
      {!loading ? (
        <button
          type="submit"
          className="inline bg-myprim-600 text-myprim-200 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
        >
          ENTRAR
        </button>
      ) : (
        <div className="w-10 h-10">
          <img
            src="https://img.icons8.com/?size=100&id=ldCN5cWRfXQ5&format=png&color=000000"
            alt=" loading"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {message && <p className="text-md text-myerror-500 font-bold">{message}</p>}
    </form>
  );
}

export default Login;
