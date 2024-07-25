
export interface AuthState {
  auth: boolean;
}

export type AuthAction =
  | { type: 'SET_AUTH'; payload: boolean }


export const initialState: AuthState = {
  auth: false
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, auth: action.payload };
    default:
      return state;
  }
};
