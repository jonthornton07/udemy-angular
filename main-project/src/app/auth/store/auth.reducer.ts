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

export function authReducer(state: State = initialState, action: Actions.AuthActions): State {
  switch (action.type) {
    case Actions.AUTH_SUCCESS:
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
    case Actions.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case Actions.LOGIN_START:
    case Actions.SIGNUP_START:
      return {
        ...state,
        error: null,
        loading: true
      }
    case Actions.CLEAR_ERROR:
      return {
        ...this.state,
        error: null
      }
    default:
      return state
  }
}
