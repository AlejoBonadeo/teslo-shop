import { AuthState } from '.';
import { User } from '../../interfaces';

type Action = | { type: 'login', payload: User } | { type: 'logout' };

export const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'login': 
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      };
    case 'logout':
        return {
            ...state,
            isLoggedIn: false,
            user: undefined
        }
    default:
      return state;
  }
}