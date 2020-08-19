import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; // ...state는 state = {} 를 가져온다.
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;
    default:
      return state;
  }
}
