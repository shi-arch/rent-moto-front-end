'use client'
import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import RootReducer from "./reducer";

const store = createStore(RootReducer, composeWithDevTools());

export default store;