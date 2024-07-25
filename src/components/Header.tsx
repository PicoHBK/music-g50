import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "../hooks/useAuth"
import apiUserPrivate from "../apis/privateUser";
import { UserType } from "../types/User";
import { act, useEffect } from "react";

const fetchUserData = async() => {
    const token = localStorage.getItem('token',);
    const {data} = await apiUserPrivate.get<UserType>(`users/profiles/profile_data/`, {
        headers: {
            'Authorization': `Token ${token}` // Incluir el token en los encabezados
        }
    });
    return data;
}


function Header() {
    const {data:user,isSuccess, isError} = useQuery({
        queryKey: ["userData"],
        queryFn: fetchUserData,
        staleTime: Infinity,
    })
    const {state, dispatch} = useAuthContext()

    useEffect(() => {

        if(isSuccess){
            dispatch({type: "SET_AUTH", payload: true})
        }
        if(isError){
            dispatch({type: "SET_AUTH", payload: false})
            localStorage.removeItem('token')
        }
    },[isSuccess, isError, dispatch])
  return (
    <header>
        {
            state.auth ? <p>Estas autenticado</p> : <p>No estas autenticado</p>
        }

        {
            user?.username && <p>{user.first_name} {user.last_name}</p>
        }

    </header>
  )
}

export default Header