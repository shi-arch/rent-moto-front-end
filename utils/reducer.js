const initialState = {
    counter: 0
};
const INCREMENT = "INCREMENT";  
const DECREMENT = "DECREMENT";

const RootReducer = (state = initialState, action) => {
    switch (action.type) {
      case INCREMENT:
        return { ...state, counter: state.counter + action.payload };
      case DECREMENT:
        return { ...state, counter: state.counter - 1 };
      default:
        return state;
    }
};

export default RootReducer