import "@/styles/globals.css";
import { useEffect } from "react";
import store from "@/utils/store";
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }) {
  // useEffect(() => {
  //   import("bootstrap.min.css");
  // }, [])
  return <>

    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>

  </>;
}
