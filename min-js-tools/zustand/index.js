const createStoreImpl = (createState) => {
    let state;
    const listeners = new Set();
    const getState = () => state;
    const setState = (partical, replace) => {
        const nextState =
            typeof partical === "function" ? partical(state) : partical;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (
                replace !== null
                    ? replace
                    : typeof nextState !== "object" || nextState === null
            )
                ? nextState
                : Object.assign({}, state, nextState);

            listeners.forEach((listener) => listener(state, previousState));
        }
    };
    const subscribe = (listener) => {
        listeners.add(listener)
        return listeners.delete(listener)
    }
    const getInitalState = () => initalState
    const api = { getState, setState, subscribe, getInitalState }
    const initalState = state => createState(setState, getState, api)
    return api
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
