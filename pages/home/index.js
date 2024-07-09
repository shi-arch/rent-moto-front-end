import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from './index.module.css'
import { useDispatch, useSelector } from "react-redux";
import { MyCarousel } from "../../utils/commonComponents";

const inter = Inter({ subsets: ["latin"] });

export default function Home() { 
  const dispatch = useDispatch();
  const data = useSelector((state) => state.counter)
  return (
    <>
      <h1 className={styles.test}>Welcome Home</h1>
      <MyCarousel />
      <h1>{data}</h1>
      <button onClick={() => dispatch({type: 'INCREMENT', payload: 5})}>Button</button>
    </>
  );
}
