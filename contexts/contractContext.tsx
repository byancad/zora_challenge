import { Contract } from "ethers";
import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useReducer,
} from "react";

// state
type State = {
  events: {
    [id: number]: string;
  };
  idMap: {
    [id: number]: Contract;
  };
};

const initialState: State = { events: {}, idMap: {} };

// actions
enum ActionTypes {
  ADD_CONTRACT_BY_ID,
  ADD_EVENT,
}

// action creator types
type Actions = ReducerActions<{
  [ActionTypes.ADD_CONTRACT_BY_ID]: { id: number; contract: Contract };
  [ActionTypes.ADD_EVENT]: { id: number; address: string };
}>;

// reducer
const reducer: Reducer<State, Actions> = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.ADD_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.id]: action.payload.address,
        },
      };
    case ActionTypes.ADD_CONTRACT_BY_ID:
      const originalIdMap = state.idMap;
      const { id, contract: contractInstance } = action.payload;
      let newState: { [id: number]: Contract } = {};
      newState[id] = contractInstance;
      return {
        ...state,
        idMap: {
          ...originalIdMap,
          ...newState,
        },
      };

    default:
      return state;
  }
};

// context
type IContext = {
  state: State;
  dispatch: Dispatch<Actions>;
  addContractById: (id: number, contract: Contract) => void;
  addEvent: (id: number, address: string) => void;
};

const Context = createContext<IContext>({} as IContext);

// context provider
export const Provider: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addContractById = (id: number, contract: Contract) => {
    dispatch({
      type: ActionTypes.ADD_CONTRACT_BY_ID,
      payload: { id, contract },
    });
  };

  const addEvent = (id: number, address: string) => {
    dispatch({
      type: ActionTypes.ADD_EVENT,
      payload: { id, address },
    });
  };

  return (
    <Context.Provider value={{ state, dispatch, addContractById, addEvent }}>
      {children}
    </Context.Provider>
  );
};

// hooks
export const useContractContext = () => {
  const { state, addContractById, addEvent } = useContext(Context);
  return { ...state, state, addContractById, addEvent };
};
