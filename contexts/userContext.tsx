import { Signer } from "ethers";
import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useReducer,
} from "react";

// state
type State = {
  address: string;
  session: boolean;
  signer: Signer | undefined;
  signerAddress: string | undefined;
  chainId: number | undefined;
};

const initialState: State = {
  address: "",
  session: false,
  signer: undefined,
  signerAddress: "",
  chainId: undefined,
};

// actions
enum ActionTypes {
  UPDATE_USER_SESSION,
  CLEAR_USER_SESSION,
  UPDATE_RALLY_USER,
  UPDATE_SIGNER,
  UPDATE_SIGNER_ADDRESS,
  CLEAR_SIGNER,
  UPDATE_CHAIN_ID,
}

// action creator types
type Actions = ReducerActions<{
  [ActionTypes.UPDATE_USER_SESSION]: State;
  [ActionTypes.CLEAR_USER_SESSION]: undefined;
  [ActionTypes.UPDATE_RALLY_USER]: { username: string; rnbUserId: string };
  [ActionTypes.UPDATE_SIGNER_ADDRESS]: string | undefined;
  [ActionTypes.UPDATE_SIGNER]: Signer | undefined;
  [ActionTypes.CLEAR_SIGNER]: undefined;
  [ActionTypes.UPDATE_CHAIN_ID]: number | undefined;
}>;

// reducer
const reducer: Reducer<State, Actions> = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER_SESSION:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.UPDATE_SIGNER:
      return {
        ...state,
        signer: action.payload,
      };

    case ActionTypes.UPDATE_SIGNER_ADDRESS:
      return {
        ...state,
        signerAddress: action.payload,
      };
    case ActionTypes.CLEAR_USER_SESSION:
      return {
        ...state,
        address: "",
        session: false,
      };
    case ActionTypes.CLEAR_SIGNER:
      return {
        ...state,
        signer: undefined,
        signerAddress: undefined,
      };
    case ActionTypes.UPDATE_CHAIN_ID:
      return {
        ...state,
        chainId: action.payload,
      };
    default:
      return state;
  }
};

// context
type IContext = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const Context = createContext<IContext>({} as IContext);

// context provider
export const Provider: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// hooks
export const useUserDispatch = (dispatch: Dispatch<Actions>) => {
  const updateUserSession = (session: State) => {
    dispatch({ type: ActionTypes.UPDATE_USER_SESSION, payload: session });
  };

  const clearUserSession = () => {
    dispatch({ type: ActionTypes.CLEAR_USER_SESSION });
  };

  const updateSigner = (signer: Signer | undefined) => {
    dispatch({ type: ActionTypes.UPDATE_SIGNER, payload: signer });
  };

  const updateSignerAddress = (address: string | undefined) => {
    dispatch({ type: ActionTypes.UPDATE_SIGNER_ADDRESS, payload: address });
  };

  const updateChainId = (chainId: number | undefined) => {
    dispatch({ type: ActionTypes.UPDATE_CHAIN_ID, payload: chainId });
  };

  return {
    updateUserSession,
    clearUserSession,
    updateSigner,
    updateSignerAddress,
    updateChainId,
  };
};

export const useUserContext = () => {
  const { state, dispatch } = useContext(Context);
  const dispatchActions = useUserDispatch(dispatch);
  return { ...state, ...dispatchActions };
};
