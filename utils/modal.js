'use client';
import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { ContactIcon, EmailIcon, EyeFilledIcon, EyeSlashFilledIcon, LocationIcon, MailIcon, NameIcon, UserIcon } from "../utils/icons";
import { useRouter } from 'next/navigation'
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Checkbox } from "@nextui-org/checkbox";
import { Image } from "@nextui-org/image";
import { useDispatch, useSelector } from "react-redux";
import { postApi } from "../app/response/api";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { mobilePattern, validateEmail } from "./constants";
import swal from 'sweetalert';

export const CitiesModal = (props) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const citiesModal = useSelector((state) => state.citiesModal);
  const citiesData = useSelector((state) => state.citiesData);
  const filterString = useSelector((state) => state.filterString);
  const goToDashboard = async (o) => {
    dispatch({ type: "SELECTEDCITY", payload: o })
    dispatch({ type: "CITIESTMODAL", payload: false })
    filterString.location = o.myLocation
    filterString.pickupLocation = o.subLocation[1].label
    dispatch({ type: "FILTERSTRING", payload: filterString })
    dispatch({ type: "PICKUPLOCATION", payload: o.subLocation[1].label })
    dispatch({ type: "DEFAULTPICKUPLOCATION", payload: o.subLocation[1].label })
  }
  return (
    <>
      <Modal
        size="2xl"
        isOpen={citiesModal}
        onOpenChange={props.closeCityModal}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Select City</ModalHeader>
              <ModalBody>
                <div className="row">
                  {
                    citiesData.map((o) => (
                      <div className="col-md-3" key={o.myLocation} style={{ margin: "0px", marginBottom: "15px", cursor: 'pointer' }}>
                        <img alt="City picture" role="button" tabIndex="0" onClick={() => goToDashboard(o)} src={o.url} width={150} height={150} />
                        <span>{o.myLocation}</span>
                      </div>
                    ))
                  }
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export const OtpModal = (props) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const otpModel = useSelector((state) => state.otpModel);
  const error = useSelector((state) => state.error);
  const mobile = useSelector((state) => state.mobile);
  const loginData = useSelector((state) => state.loginData);
  const [otp, setOtp] = useState("")

  const verifyOtp = () => {
    if (otp.length == 6) {
      dispatch({ type: "OTPMODEL", payload: false })
      dispatch({ type: "ERROR", payload: "" })
      dispatch({ type: "ISLOGGEDIN", payload: true })
      localStorage.setItem('loginData', JSON.stringify(loginData))
      localStorage.setItem('isLoggedIn', true)
      swal({
        title: "Congratulations!",
        text: "You have successfulluy logged in!",
        icon: "success",
        dangerMode: true,
      })
      //router.push('/dashboard')
    } else {
      dispatch({ type: "ERROR", payload: "Enter 6 digit otp" })
    }
  }
  return (
    <>
      <Modal
        isOpen={otpModel}
        placement="top-center"
        onOpenChange={props.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">OTP</ModalHeader>
              <ModalBody>
                <Input
                  type="password"
                  value={otp}
                  isInvalid={error ? true : false}
                  errorMessage={error}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                  label="OTP"
                  placeholder="Enter 6 digit otp"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button style={{ color: "white", background: "black" }} onClick={verifyOtp}>
                  Verify Otp
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export const LoginModal = (props) => {
  const dispatch = useDispatch()
  const { onOpenChange } = props;
  const showLoginModel = useSelector((state) => state.showLoginModel);
  const router = useRouter()
  const error = useSelector((state) => state.error);
  const userDetails = useSelector((state) => state.userDetails);

  const isValid = () => {
    let isValid = true
    const { contact } = userDetails
    if (!contact) {
      isValid = false
      dispatch({ type: "ERROR", payload: "Enter mobile number" })
    } else if (!mobilePattern.test(contact)) {
      isValid = false
      dispatch({ type: "ERROR", payload: "Enter 10 digit mobile number" })
    } else {
      isValid = true
      dispatch({ type: "ERROR", payload: "" })
    }
    return isValid
  }
  const verify = async () => {
    if (isValid()) {
      const res = await postApi('/getUsersByContact', { contact: parseInt(userDetails.contact) })
      if (res.status == 200) {
        dispatch({ type: "LOGINDATA", payload: res.data })
        dispatch({ type: "SHOWLOGINMODEL", payload: false })
        dispatch({ type: "OTPMODEL", payload: true })
      } else {
        dispatch({ type: "SHOWLOGINMODEL", payload: false })
        dispatch({ type: "SHOWSIGNUPMODAL", payload: true })
      }
    }
  }
  return (
    <Modal
      isOpen={showLoginModel}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
            <ModalBody>
              <Input
                isInvalid={error ? true : false}
                errorMessage={error}
                value={userDetails.contact}
                onChange={(e) => dispatch({ type: "USERDETAILS", payload: { ...userDetails, contact: e.target.value } }) || setMobile(e.target.value)}
                autoFocus
                endContent={
                  <ContactIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Mobile Number"
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button style={{ background: '#000', color: 'white' }} onClick={verify}>
                Verify
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

//dispatch({ type: "PAYMENTMODEL", payload: false })

export const PaymentModal = (props) => {
  const dispatch = useDispatch()
  const { onOpenChange } = props;
  const {showPayModel, paymentMethod} = useSelector((state) => state);
  return (
    <Modal
      isOpen={showPayModel}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Select Payment Type</ModalHeader>
            <ModalBody>
              <RadioGroup
                label="If you want to pay on pickup, Please make 10% advance payment"
              >
                <Radio onChange={() => dispatch({ type: "PAYMENTMETHOD", payload: 'Online' })} value="Online">Online</Radio>
                <Radio onChange={() => dispatch({ type: "PAYMENTMETHOD", payload: 'Cash' })} value="Cash">Cash</Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button disabled={!paymentMethod} onClick={() => props.makePayment(paymentMethod)} style={{ background: '#000', color: 'white' }}>
                Proceed
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export const SignUpModal = (props) => {
  const dispatch = useDispatch()
  const { onOpenChange } = props;
  const router = useRouter()
  const { error, showSignUpModel, userDetails } = useSelector((state) => state)
  const [otp, setOtp] = useState("")
  const [startTimer, setStartTimer] = useState(false)
  const [count, setCount] = useState(0)
  const [mobile, setMobile] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (startTimer) {
      setStartTimer(false)
      setTimeout(() => {
        setStartTimer(true)
        if (count == 10) {
          setStartTimer(false)
          setCount(0)
        } else {
          setCount(count + 1)
        }
      }, 1000)
    }
  }, [startTimer])

  const isValid = () => {
    const { firstName, lastName, email, contact, password } = userDetails
    let isValid = true
    if (!firstName) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "firstName", message: "Please enter first name" } })
    } else if (!lastName) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "lastName", message: "Please enter last name" } })
    } else if (!email) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Please enter email" } })
    } else if (email && !validateEmail(email)) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Enter correct email" } })
    } else if (email && validateEmail(email) && !otpSent && !isEmailVerified) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Please verify your email" } })
    } else if (!otp) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "otp", message: "Please enter otp" } })
    } else if (otp && otp.length != 6) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "otp", message: "Please enter valid otp" } })
    } else if (!contact) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "contact", message: "Enter mobile number" } })
    } else if (contact && !mobilePattern.test(contact)) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "contact", message: "Enter 10 digit mobile number" } })
    } else if (!password) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "password", message: "Enter password" } })
    } else {
      dispatch({ type: "ERROR", payload: "" })
    }
    return isValid
  }
  const verify = async () => {
    if (isValid()) {
      const res = await postApi('/signup', userDetails)
      if (res.status == 200) {
        dispatch({ type: "SHOWSIGNUPMODAL", payload: false })
        swal({
          title: "Congratulation!",
          text: "You have signed up successfully!",
          icon: "success",
          dangerMode: true,
        })
      }
    }
  }
  const setUserData = (value, type) => {
    const newObj = Object.assign(userDetails, { [type]: value });
    dispatch({ type: "USERDETAILS", payload: newObj })
  }

  const sendOtp = async () => {
    const { email } = userDetails
    let isValid = true
    if (!email) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Please enter email" } })
    } else if (email && !validateEmail(email)) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Enter correct email" } })
    } else {
      dispatch({ type: "ERROR", payload: { type: "", message: "" } })
    }
    if (isValid) {
      dispatch({ type: "LOADING", payload: true })
      const res = await postApi('/sendOtp', { email })
      dispatch({ type: "LOADING", payload: false })
      if (res.status == 200) {
        swal({
          title: "Otp sent successfully to " + email,
          text: "Please check your email",
          icon: "success",
          dangerMode: true,
        }).then(() => {
          dispatch({ type: "SHOWSIGNUPMODAL", payload: true })
          setOtpSent(true)
          setStartTimer(true)
        })

      }
    }
  }

  const verifyOtp = async () => {
    let isValid = true
    if (!otp) {
      dispatch({ type: "ERROR", payload: { type: "otp", message: "Please enter otp" } })
      isValid = false
    } else if (otp && otp.length !== 6) {
      dispatch({ type: "ERROR", payload: { type: "otp", message: "Please enter valid otp" } })
      isValid = false
    } else {
      dispatch({ type: "ERROR", payload: { type: "", message: "" } })
      isValid = true
    }
    if (isValid) {
      dispatch({ type: "LOADING", payload: true })
      const res = await postApi('/verifyOtp', { otp })
      dispatch({ type: "LOADING", payload: false })
      if (res.status == 200) {
        setIsEmailVerified(true)
        setOtpSent(false)
        dispatch({ type: "ERROR", payload: { type: "", message: "" } })
      } else {
        dispatch({ type: "ERROR", payload: { type: "otp", message: "Invalid otp" } })
      }
    }
  }
  return (
    <Modal
      isOpen={showSignUpModel}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">Sign up</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="col-md-6">
                    <Input
                      isInvalid={error.type == "firstName" ? true : false}
                      errorMessage={error.message}
                      value={userDetails.firstName}
                      onChange={(e) => setUserData(e.target.value, 'firstName')}
                      autoFocus
                      endContent={
                        <NameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="First name"
                      variant="bordered"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      isInvalid={error.type == "lastName" ? true : false}
                      errorMessage={error.message}
                      value={userDetails.lastName}
                      onChange={(e) => setUserData(e.target.value, 'lastName')}
                      autoFocus
                      endContent={
                        <NameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Last name"
                      variant="bordered"
                    />
                  </div>
                </div>
                <Input
                  isInvalid={error.type == "email" ? true : false}
                  errorMessage={error.message}
                  value={userDetails.email}
                  onChange={(e) => setUserData(e.target.value, 'email')}
                  autoFocus
                  endContent={
                    <Button disabled={count ? true : false} className="focus:outline-none" style={{ pointerEvents: isEmailVerified ? "none" : "" }} onClick={isEmailVerified ? null : sendOtp} type="button">{
                      isEmailVerified ? "Verified" : otpSent ? "Resend Otp" : "Send Otp"
                    }</Button>

                    // 
                  }
                  label="Email"
                  variant="bordered"
                />
                {
                  count ? <span style={{ paddingLeft: "10px", color: "red" }}>Resend otp in 10 seconds ... {count} second </span> : null
                }
                {
                  otpSent ? <Input
                    type="password"
                    isInvalid={error.type == "otp" ? true : false}
                    errorMessage={error.message}
                    onChange={(e) => setOtp(e.target.value)}
                    autoFocus
                    endContent={
                      <Button className="focus:outline-none" onClick={verifyOtp} type="button">Verify</Button>
                    }
                    label="Otp"
                    variant="bordered"
                  /> : null
                }

                <Input
                  isInvalid={error.type == "contact" ? true : false}
                  errorMessage={error.message}
                  value={userDetails.contact}
                  onChange={(e) => setUserData(e.target.value, 'contact')}
                  autoFocus
                  endContent={
                    <ContactIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Contact"
                  variant="bordered"
                />
                <Input
                  isInvalid={error.type == "password" ? true : false}
                  type={isVisible ? "text" : "password"}
                  errorMessage={error.message}
                  value={userDetails.password}
                  onChange={(e) => setUserData(e.target.value, 'password')}
                  autoFocus
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                      {isVisible ? (
                        <EyeSlashFilledIcon />
                      ) : (
                        <EyeFilledIcon />
                      )}
                    </button>
                  }
                  label="Password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button style={{ background: "black", color: "white" }} onClick={verify}>
                  Proceed
                </Button>
              </ModalFooter>
            </>
          )
        }}
      </ModalContent>
    </Modal>
  )
}
