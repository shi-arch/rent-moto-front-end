import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import { AcmeLogo } from "./icons";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Router, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Caret } from "@/utils/icons";
import { ProfileDrop } from "./commonComponents";
import { LoginModal, OtpModal, SignUpModal } from "@/utils/modal";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const selectedCity = useSelector(state => state.selectedCity)
    const loginData = useSelector(state => state.loginData)
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const dispatch = useDispatch();

    const locate = () => {
        dispatch({ type: "CITIESTMODAL", payload: true })
    }

    const menuItems = [
        { label: "Home", route: "/" },
        { label: "Explore", route: "/dashboard" },
        { label: "Select Location" }
    ];

    return (
        <>
            <OtpModal onOpenChange={() => dispatch({ type: "OTPMODEL", payload: false })} />
            <LoginModal onOpenChange={() => dispatch({ type: "SHOWLOGINMODEL", payload: false })} />
            <SignUpModal onOpenChange={() => dispatch({ type: "SHOWSIGNUPMODAL", payload: false })} />
            <Navbar style={{ color: "white", padding: "0px" }} className="test" onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand style={{ marginTop: "10px" }}>
                        <AcmeLogo />
                        <p className="font-bold text-inherit" style={{ marginTop: "16px" }}>RENTO</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-4" justify="center" style={{ marginTop: "10px", color: "white" }}>
                    <NavbarItem>
                        <Link style={{ color: "white", fontWeight: "bold" }} color="foreground" href="/" aria-current="page">
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="/dashboard" style={{ color: "white", fontWeight: "bold" }} color="foreground" aria-current="page">
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
                <NavbarContent justify="end" style={{ marginTop: "10px", marginLeft: "0px" }}>
                    <NavbarItem>
                        <div style={{ marginTop: "6px" }}>
                            {
                                loginData && isLoggedIn ? <ProfileDrop />
                                    : <Button onClick={() => {
                                        dispatch({ type: "ERROR", payload: "" })
                                        dispatch({ type: "SHOWLOGINMODEL", payload: true })
                                    }} className="mobile-login" style={{ color: "white", background: "#e03546", padding: "21px", fontWeight: "700", border: "3px solid white" }} variant="flat">
                                        Sign Up / Login
                                    </Button>
                            }
                        </div>
                    </NavbarItem>
                </NavbarContent>
                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem role="button" key={`${item}-${index}`}>
                            <Link
                                onClick={() => {
                                    if (item.label == "Select Location") {
                                        dispatch({ type: "CITIESTMODAL", payload: true })
                                    }
                                }}
                                color={'danger'}
                                className="w-full"
                                href={item?.route ? item?.route : "#"}
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </>

    );
}
