import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import {
  createContext,
  useReducer,
  useEffect,
  useRef,
  useContext,
  type Reducer,
  type Dispatch,
} from "react";
import { AwaitTransaction } from "../components/Toast/AwaitTransaction";

// state
type State = {
  awaitingTxs: string[];
  awaitingSig: boolean;
};

const initialState: State = {
  awaitingTxs: [],
  awaitingSig: false,
};

// actions
enum ActionTypes {
  AWAIT_TX_ALERT,
  REMOVE_TX_ALERT,
  UPDATE_AWAITING_SIG,
}

type Actions = ReducerActions<{
  [ActionTypes.AWAIT_TX_ALERT]: string;
  [ActionTypes.REMOVE_TX_ALERT]: string;
  [ActionTypes.UPDATE_AWAITING_SIG]: boolean;
}>;

// reducer
const reducer: Reducer<State, Actions> = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.AWAIT_TX_ALERT:
      return {
        ...state,
        awaitingTxs: [...state.awaitingTxs, action.payload],
      };
    case ActionTypes.REMOVE_TX_ALERT:
      const awaitingTxs = state.awaitingTxs.filter((tx: string) => {
        return tx !== action.payload;
      });
      return {
        ...state,
        awaitingTxs: [...awaitingTxs],
      };

    case ActionTypes.UPDATE_AWAITING_SIG:
      return {
        ...state,
        awaitingSig: action.payload,
      };
    default:
      return state;
  }
};

// context
type IContext = {
  state: State;
  dispatch: Dispatch<Actions>;
  popToast: (options: UseToastOptions) => void;
};

const Context = createContext<IContext>({} as IContext);

// context provider
export const AlertProvider: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { awaitingTxs } = state;

  const toast = useToast();
  const txToastId = useRef<ToastId>();

  const popToast = (info: UseToastOptions) => {
    const { title, description, status, duration, isClosable } = info;
    toast({
      title,
      description,
      status,
      duration: duration,
      isClosable: isClosable,
      variant: "solid",
      position: "top-right",
    });
  };

  useEffect(() => {
    if (awaitingTxs.length && !txToastId.current) {
      txToastId.current = toast({
        render: AwaitTransaction,
        duration: null,
        position: "bottom-left",
      });
    }

    if (!awaitingTxs.length && txToastId.current) {
      toast.close(txToastId.current);
      txToastId.current = undefined;
    }
  }, [awaitingTxs]);

  return (
    <Context.Provider value={{ state, dispatch, popToast }}>
      {children}
    </Context.Provider>
  );
};

export const useAlertDispatch = (dispatch: Dispatch<Actions>) => {
  const awaitTx = (tx: string) => {
    dispatch({ type: ActionTypes.AWAIT_TX_ALERT, payload: tx });
  };

  const removeTx = (tx: string) => {
    dispatch({ type: ActionTypes.REMOVE_TX_ALERT, payload: tx });
  };

  const awaitSig = (awaiting: boolean) => {
    dispatch({ type: ActionTypes.UPDATE_AWAITING_SIG, payload: awaiting });
  };

  return { awaitTx, removeTx, awaitSig };
};

// hook
export const useAlertContext = () => {
  const { state, dispatch, popToast } = useContext(Context);
  const dispatchActions = useAlertDispatch(dispatch);

  return { ...state, ...dispatchActions, popToast };
};
