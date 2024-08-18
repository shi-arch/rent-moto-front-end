'use client'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@nextui-org/input";
import { AcmeLogo } from "./icons";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { now, parseAbsoluteToLocal } from "@internationalized/date";
import { Caret, LocationIcon, MailIcon, UserIcon } from "../utils/icons";
import { Router, useRouter } from "next/navigation";
import earth from '../utils/images/earth.gif'
import Image from 'next/image'
import { postApi } from "../app/response/api";
import { LoginModal, OtpModal, SignUpModal } from "../utils/modal";
import { ProfileDrop } from "./commonComponents";
const menuItems = [
  "Profile",
  "Dashboard",
  "Activity",
  "Analytics",
  "System",
  "Deployments",
  "My Settings",
  "Team Settings",
  "Help & Feedback",
  "Log Out",
];
export const NavigationBar = () => {
  const router = useRouter()
  const [test, setTest] = useState(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  let [date, setDate] = useState(parseAbsoluteToLocal("2021-04-07T18:45:22Z"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const dispatch = useDispatch();
  const selectedCity = useSelector(state => state.selectedCity)
  const error = useSelector(state => state.error)
  const loginData = useSelector(state => state.loginData)
  const isLoggedIn = useSelector(state => state.isLoggedIn)

  useEffect(() => {
    document.getElementsByTagName("header")[0].style.maxWidth = "1414px"
  }, [])

  return (
    <>
      <OtpModal onOpenChange={() => dispatch({ type: "OTPMODEL", payload: false })} />
      <LoginModal onOpenChange={() => dispatch({ type: "SHOWLOGINMODEL", payload: false })} />
      <SignUpModal onOpenChange={() => dispatch({ type: "SHOWSIGNUPMODAL", payload: false })} />
      <Navbar style={{ backgroundColor: "#e03546" }} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent style={{ marginTop: "10px" }}>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <AcmeLogo />
            <p style={{ marginTop: "16px", color: "white" }} className="font-bold text-inherit">RENTO</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent style={{ marginTop: "10px" }} className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link style={{ color: "white" }} color="foreground" href="/" aria-current="page">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/dashboard" style={{ color: "white" }} color="foreground" aria-current="page">
              Explore
            </Link>
          </NavbarItem>
          <NavbarItem>
            <div role="button" tabIndex="0" onClick={() => dispatch({ type: "CITIESTMODAL", payload: true })} style={{ border: '2.5px solid white', borderRadius: '10px', cursor: 'pointer', marginTop: '5px' }} className="w-full flex flex-col items-start gap-4">
              <div style={{ display: 'flex', padding: '3px 0px 4px 16px', marginTop: '6px' }}>
                <span style={{ marginBottom: "5px", fontWeight: "700", color: "white" }}>{selectedCity?.myLocation}</span>
                <div style={{ padding: "0px 10px" }}>
                  <Caret />
                </div>
              </div>
            </div>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" style={{ marginTop: "10px" }}>
          <NavbarItem>
            <div style={{marginTop: "6px", marginRight: "40px" }}>
            {
              loginData && isLoggedIn ? <ProfileDrop />
              : <Button onClick={() => {
                dispatch({ type: "ERROR", payload: "" })
                dispatch({ type: "SHOWLOGINMODEL", payload: true })
              }} style={{ color: "white", background: "#e03546", padding: "21px", fontWeight: "700", border: "3px solid white" }} variant="flat">
                Sign Up or Login
              </Button>
            }            
            </div>            
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                }
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>

  );
};

