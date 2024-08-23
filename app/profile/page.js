
'use client'
import React, { useEffect, useState } from 'react';
import './dashboard.css'
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { BikeCard, Loading, SubHeader } from '../../components/commonComponents';
import { Select, SelectItem, useSelect } from "@nextui-org/select";
import { postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, brands, categories, defaultVal, dispatchFunction, mobilePattern, validateEmail } from '../../utils/constants';
import { CitiesModal } from '../../utils/modal';
import { Input } from "@nextui-org/input";
import { useRouter } from 'next/navigation';
import { ContactIcon, EmailIcon, EyeFilledIcon, EyeSlashFilledIcon, NameIcon } from '../../utils/icons';
import { Button } from '@nextui-org/button';
import { user } from '@nextui-org/theme';

export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { error, showSignUpModel } = useSelector((state) => state)
  const [mobile, setMobile] = useState("")
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [userDetails, setUserDetauls] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("loginData")
    if (data) {
      let parseData = JSON.parse(data)
      setUserDetauls(parseData)
    }
  }, [])

  const isValid = () => {
    const { firstName, lastName, email, contact, password } = userDetails
    let isValid = true
    if (!firstName) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "firstName", message: "Enter first name" } })
    } else if (!lastName) {
      isValid = true
      dispatch({ type: "ERROR", payload: { type: "lastName", message: "Enter last name" } })
    } else if (!email) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Enter email" } })
    } else if (email && !validateEmail(email)) {
      isValid = false
      dispatch({ type: "ERROR", payload: { type: "email", message: "Enter correct email" } })
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
      delete userDetails._id
      const res = await postApi('/signup', userDetails)
      if (res.status == 401) {
        dispatch({ type: "SHOWSIGNUPMODAL", payload: false })
        dispatch({ type: "LOGINDATA", payload: userDetails })
        localStorage.setItem('loginData', JSON.stringify(userDetails))
        swal({
          title: "Congratulation!",
          text: "You have updated your profile successfully!",
          icon: "success",
          dangerMode: true,
        })
      }
    }
  }
  const setUserData = (value, type) => {
    Object.assign(userDetails, { [type]: value });
    dispatch({ type: "USERDETAILS", payload: userDetails })
  }

  const fileUpload = async (file) => {
    const formData = new FormData();
    formData.append('profileImg', file);
    const response = await postApi('/image-upload', {formData})
    if(response && response.data){
      userDetails.profilePic = response.data
      dispatch({ type: "USERDETAILS", payload: userDetails })
    }
  }
  return (
    <div className='container'>
      <div style={{ textAlign: 'center', margin: '29px 315px' }}>
        <Card>
          <CardHeader style={{ display: "block" }}>
            <h3 style={{ color: 'green' }}>Hi {userDetails.firstName}</h3>
          </CardHeader>
          {/* <hr /> */}
          <CardBody>
            <div className="row" style={{ margin: "20px 0px" }}>
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
            <div className="row" style={{ margin: "20px 0px" }}>
              <div className="col-md-6">
                <div>
                  <span style={{ fontSize: "12px" }}>Adhar Card</span>
                  <input onChange={(e) => fileUpload(e.target.files[0], 'adharCard')} className='form-control' type="file" />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <span style={{ fontSize: "12px" }}>Driving Licence</span>
                  <input className='form-control'  type="file" onChange={(e) => fileUpload(e.target.files[0], 'drivingLincence')} />
                </div>
              </div>
            </div>
            <div style={{ margin: "20px 0px" }}>
              <Input
                isInvalid={error.type == "email" ? true : false}
                errorMessage={error.message}
                value={userDetails.email}
                onChange={(e) => setUserData(e.target.value, 'email')}
                autoFocus
                endContent={
                  <EmailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                variant="bordered"
              />
            </div>
            <div style={{ margin: "20px 0px" }}>
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
            </div>
            <div style={{ margin: "20px 0px" }}>
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
            </div>

            <Button style={{ background: "black", color: "white" }} onClick={verify}>
              Update
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
