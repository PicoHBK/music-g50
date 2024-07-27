import { UserType } from "@/types/User";

export interface AuthState {
  auth: boolean;
  user: UserType | undefined
}

export type AuthAction =
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'SET_USER'; payload: UserType | undefined };


export const initialState: AuthState = {
  auth: false,
  user: undefined
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, auth: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
