import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getWindowSize } from "../../utils/commonComponents";
import logo from '../../utils/assets/logo.png'


export default function Home() {
  let data = getWindowSize()
  const [display, setDisplay] = useState(false);
  const [showNav, setShowNav] = useState(true);
  useEffect(() => {
    if (data < 990) {
      setDisplay(false)
      setShowNav(false)
    } else {
      setShowNav(true)
    }
  }, [data])
  return (
    <>
      <header class="bg-dark text-white py-3" style={{ position: 'fixed', width: '100%', zIndex: '10' }}>
        <div class="container d-flex justify-content-between align-items-center">
          <img src="https://gobikes.co.in/images/logo-color.svg" alt="GoBikes Logo" class="logo" />
          {
            showNav ?
            <nav>
            <ul class="nav">
              <li class="nav-item"><a href="#" class="nav-link text-white">Offers</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">Monthly Rentals</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">List your Vehicle</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">Login</a></li>
            </ul>
          </nav>
          : null
          }
          
        </div>
      </header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <button class="navbar-toggler" onClick={() => setDisplay(!display)} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          {
            display ?
              <div class="navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Dropdown
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li><a class="dropdown-item" href="#">Another action</a></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                  </li>
                </ul>
                <form class="d-flex">
                  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
              </div> : null
          }

        </div>
      </nav>
    </>
  );
}

