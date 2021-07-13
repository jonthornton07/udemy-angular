import {User} from "../user.model";
import * as Actions from "./auth.actions";

export interface State {
  user: User,
  error: string
  loading: boolean
}

const initialState: State = {
  user: null,
  error: null,
  loading: false
}

export function authReducer(state: State = initialState, action: Actions.AuthActions) {
  switch (action.type) {
    case Actions.LOGIN:
      const user = new User(
        action.email,
        action.userId,
        action.token,
        action.expirationDate)
      return {
        ...state,
        user,
        error: null,
        loading: false
      }
    case Actions.LOGOUT:
      return {
        ...state,
        user: initialState.user
      }
    case Actions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.error,
        loading: false
      }
    case Actions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      }
    default:
      return state
  }
}
