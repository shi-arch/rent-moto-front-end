
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
import { ContactIcon, EmailIcon, EyeFilledIcon, EyeSlashFilledIcon, NameIcon, ProfileIcon } from '../../utils/icons';
import { Button } from '@nextui-org/button';
import userGif from '../../utils/images/user.gif'
import profile from '../../utils/images/profile.png'
import money from '../../utils/images/money.png'
import booking from '../../utils/images/booking.png'
import { user } from '@nextui-org/theme';
import Image from 'next/image';
import ProfileTabs from '../../components/tabs';
import moment from 'moment';

export default function Page() {
  const dispatch = useDispatch()
  const { bookings } = useSelector((state) => state.loginData);
  const router = useRouter()
  const { error, showSignUpModel } = useSelector((state) => state)
  const [mobile, setMobile] = useState("")
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [userDetails, setUserDetauls] = useState("")
  const [bookingTabName, setBookingTabName] = useState("upcoming")  
  const [custBookingData, setCustBookingData] = useState("")
  const [tabName, setTabName] = useState("profile")

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
    const response = await postApi('/image-upload', { formData })
    if (response && response.data) {
      userDetails.profilePic = response.data
      dispatch({ type: "USERDETAILS", payload: userDetails })
    }
  }
  useEffect(() => {
    if (bookings.length) {
      const obj = {
        upComingBookings: [],
        completedBookings: [],
        currentBookings: []
      }
      const currentTime = new Date().getTime()
      for (let i = 0; i < bookings.length; i++) {
        let { startDate, startTime } = bookings[i].bookingData.BookingStartDateAndTime
        let { endDate, endTime } = bookings[i].bookingData.BookingEndDateAndTime
        let bookingStartHours = new Date(moment(startTime, "hh:mm A")).getHours()
        let bookingStartMinutes = new Date(moment(startTime, "hh:mm A")).getMinutes()
        let bookingEndHours = new Date(moment(endTime, "hh:mm A")).getHours()
        let bookingEndMinutes = new Date(moment(endTime, "hh:mm A")).getMinutes()
        let bookingStartDate = moment(startDate).add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
        let bookingEndDate = moment(endDate).add(bookingEndHours, 'hours').add(bookingEndMinutes, 'minutes')
        bookingEndDate = new Date(bookingEndDate.format()).getTime()
        bookingStartDate = new Date(bookingStartDate.format()).getTime()
        if (bookingStartDate > currentTime) {
          obj.upComingBookings.push(bookings[i])
        } else if (currentTime > bookingStartDate && currentTime < bookingEndDate) {
          obj.currentBookings.push(bookings[i])
        } else {
          obj.completedBookings.push(bookings[i])
        }
      }
      setCustBookingData(obj)
    }
  }, [])
  return (
    <div className='container' style={{ marginTop: "35px" }}>
      <div style={{ textAlign: 'center' }}>
        <div className='row'>
          <div className='col-md-3'>
            <Card>
              <CardHeader style={{ display: "block" }}>
                <Image src={userGif} />
                <h3 style={{ color: '#e03546' }}>Hi {userDetails?.firstName}</h3>
              </CardHeader>
            </Card>
            <div onClick={() => setTabName("profile")} className={tabName == "profile" ? "selectedColor" : ""} style={{ border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px 0px", cursor: "pointer", background: "#e03546", }}>
              <Image src={profile} style={{ width: "36px" }} />
              <span className={tabName == "profile" ? "selectedFont" : ""} style={{ marginLeft: "20px", color: "white", fontWeight: "bold", fontSize: "20px" }}>Profile</span>
            </div>
            <div onClick={() => setTabName("bookings")} className={tabName == "bookings" ? "selectedColor" : ""} style={{ border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px 0px", cursor: "pointer", background: "#e03546", }}>
              <Image src={booking} style={{ width: "36px" }} />
              <span className={tabName == "bookings" ? "selectedFont" : ""} style={{ marginLeft: "20px", color: "white", fontWeight: "bold", fontSize: "20px" }}>Bookings</span>
            </div>
            <div onClick={() => setTabName("coins")} className={tabName == "coins" ? "selectedColor" : ""} style={{ border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px 0px", cursor: "pointer", background: "#e03546", }}>
              <Image src={money} style={{ width: "36px" }} />
              <span className={tabName == "coins" ? "selectedFont" : ""} style={{ marginLeft: "20px", color: "white", fontWeight: "bold", fontSize: "20px" }}>Coins</span>
            </div>
          </div>
          <div className='col-md-9'>
            {
              tabName == "profile" ?
                <Card>
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
                          <input className='form-control' type="file" onChange={(e) => fileUpload(e.target.files[0], 'drivingLincence')} />
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
                </Card> : ""
            }
            {
              tabName == "bookings" ?
                <>
                  <Card style={{ padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: "flex" }}>
                    <div className={bookingTabName == "upcoming" ? "selectedColor" : ""} onClick={() => setBookingTabName("upcoming")} style={{border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px auto", cursor: "pointer", background: "#e03546", }}>
                      <span className={bookingTabName == "upcoming" ? "selectedFont" : ""} style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Upcoming Rides</span>
                    </div>
                    <div onClick={() => setBookingTabName("current")} className={bookingTabName == "current" ? "selectedColor" : ""} style={{marginRight: "auto",  border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px auto", cursor: "pointer", background: "#e03546", }}>
                      <span className={bookingTabName == "current" ? "selectedFont" : ""} style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Current Rides</span>
                    </div>
                    <div onClick={() => setBookingTabName("completed")} className={bookingTabName == "completed" ? "selectedColor" : ""} style={{marginRight: "auto",  border: "3.5px solid #e03546", borderRadius: "10px", padding: "10px", display: "flex", margin: "20px auto", cursor: "pointer", background: "#e03546", }}>
                      <span className={bookingTabName == "completed" ? "selectedFont" : ""} style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Completed Rides</span>
                    </div>
                  </div>
                    <div className='row' style={{ textAlign: 'center', display: "flex" }}>
                      {
                        bookingTabName == "upcoming" ?
                        custBookingData && custBookingData.upComingBookings ?
                        custBookingData.upComingBookings.map((obj) => {
                          const { bookingData, vehicleData } = obj
                          const { brand, distanceLimit, name, pricePerday, transmissionType, url } = vehicleData
                          const { location, vehicleNumber, BookingEndDateAndTime, BookingStartDateAndTime, bookingAmount, _id, pickupLocation } = bookingData
                          return (
                            <div className='col-md-12' style={{ marginBottom: '25px' }}>
                              <Card style={{ marginLeft: 'auto' }}>
                                <CardHeader>
                                </CardHeader>
                                <CardBody>
                                  <div className='row'>
                                    <div className='col-md-4'>
                                      <img alt="Svg icon" src={url} style={{ width: '200px' }} />
                                    </div>
                                    <div className='col-md-8'>
                                      <h6 style={{ color: '#e03546', marginLeft: 'auto' }}>{name}</h6>
                                      <label>Booking ID : <span style={{ color: '#e03546' }}>{_id.substr(0, 8)}</span> | Vehicle Number : <span style={{ color: '#e03546' }}>{vehicleNumber}</span> </label>
                                      <label>Pickup Location : <span style={{ color: '#e03546' }}>{pickupLocation}</span> | City: <span style={{ color: '#e03546' }}>{location}</span> </label>
                                      <label>Pickup Time : <span style={{ color: '#e03546' }}>{BookingStartDateAndTime.startTime}</span> | Drop Time : <span style={{ color: '#e03546' }}>{BookingEndDateAndTime.endTime}</span> </label>
                                      <label>Drop Date : <span style={{ color: '#e03546' }}>{moment(BookingEndDateAndTime.endDate).format('D MMM, YYYY')}</span> | Pickup Date : <span style={{ color: '#e03546' }}>{moment(BookingStartDateAndTime.startDate).format('D MMM, YYYY')}</span> </label>
                                      <label>Booking Amount : <span style={{ color: '#e03546' }}>{bookingAmount}</span> | Disptance Limit : <span style={{ color: '#e03546' }}>{distanceLimit}</span> </label>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          )
                        }) : <div style={{ border: '2px dashed #00a32a', padding: '10px', marginBottom: '10px' }}><h1>No Bookings</h1></div> : ""
                      }
                      {
                        bookingTabName == "current" ?
                        custBookingData && custBookingData.currentBookings ?
                        custBookingData.currentBookings.map((obj) => {
                          const { bookingData, vehicleData } = obj
                          const { brand, distanceLimit, name, pricePerday, transmissionType, url } = vehicleData
                          const { location, vehicleNumber, BookingEndDateAndTime, BookingStartDateAndTime, bookingAmount, _id, pickupLocation } = bookingData
                          return (
                            <div className='col-md-12' style={{ marginBottom: '25px' }}>
                              <Card style={{ marginLeft: 'auto' }}>
                                <CardHeader>
                                </CardHeader>
                                <CardBody>
                                  <div className='row'>
                                    <div className='col-md-4'>
                                      <img alt="Svg icon" src={url} style={{ width: '200px' }} />
                                    </div>
                                    <div className='col-md-8'>
                                      <h6 style={{ color: '#e03546', marginLeft: 'auto' }}>{name}</h6>
                                      <label>Booking ID : <span style={{ color: '#e03546' }}>{_id.substr(0, 8)}</span> | Vehicle Number : <span style={{ color: '#e03546' }}>{vehicleNumber}</span> </label>
                                      <label>Pickup Location : <span style={{ color: '#e03546' }}>{pickupLocation}</span> | City: <span style={{ color: '#e03546' }}>{location}</span> </label>
                                      <label>Pickup Time : <span style={{ color: '#e03546' }}>{BookingStartDateAndTime.startTime}</span> | Drop Time : <span style={{ color: '#e03546' }}>{BookingEndDateAndTime.endTime}</span> </label>
                                      <label>Drop Date : <span style={{ color: '#e03546' }}>{moment(BookingEndDateAndTime.endDate).format('D MMM, YYYY')}</span> | Pickup Date : <span style={{ color: '#e03546' }}>{moment(BookingStartDateAndTime.startDate).format('D MMM, YYYY')}</span> </label>
                                      <label>Booking Amount : <span style={{ color: '#e03546' }}>{bookingAmount}</span> | Disptance Limit : <span style={{ color: '#e03546' }}>{distanceLimit}</span> </label>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          )
                        }) : <div style={{ border: '2px dashed #00a32a', padding: '10px', marginBottom: '10px' }}><h1>No Bookings</h1></div> : ""
                      }
                      {
                        bookingTabName == "completed" ?
                        custBookingData && custBookingData.completedBookings ?
                        custBookingData.completedBookings.map((obj) => {
                          const { bookingData, vehicleData } = obj
                          const { brand, distanceLimit, name, pricePerday, transmissionType, url } = vehicleData
                          const { location, vehicleNumber, BookingEndDateAndTime, BookingStartDateAndTime, bookingAmount, _id, pickupLocation } = bookingData
                          return (
                            <div className='col-md-12' style={{ marginBottom: '25px' }}>
                              <Card style={{ marginLeft: 'auto' }}>
                                <CardHeader>
                                </CardHeader>
                                <CardBody>
                                  <div className='row'>
                                    <div className='col-md-4'>
                                      <img alt="Svg icon" src={url} style={{ width: '200px' }} />
                                    </div>
                                    <div className='col-md-8'>
                                      <h6 style={{ color: '#e03546', marginLeft: 'auto' }}>{name}</h6>
                                      <label>Booking ID : <span style={{ color: '#e03546' }}>{_id.substr(0, 8)}</span> | Vehicle Number : <span style={{ color: '#e03546' }}>{vehicleNumber}</span> </label>
                                      <label>Pickup Location : <span style={{ color: '#e03546' }}>{pickupLocation}</span> | City: <span style={{ color: '#e03546' }}>{location}</span> </label>
                                      <label>Pickup Time : <span style={{ color: '#e03546' }}>{BookingStartDateAndTime.startTime}</span> | Drop Time : <span style={{ color: '#e03546' }}>{BookingEndDateAndTime.endTime}</span> </label>
                                      <label>Drop Date : <span style={{ color: '#e03546' }}>{moment(BookingEndDateAndTime.endDate).format('D MMM, YYYY')}</span> | Pickup Date : <span style={{ color: '#e03546' }}>{moment(BookingStartDateAndTime.startDate).format('D MMM, YYYY')}</span> </label>
                                      <label>Booking Amount : <span style={{ color: '#e03546' }}>{bookingAmount}</span> | Disptance Limit : <span style={{ color: '#e03546' }}>{distanceLimit}</span> </label>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          )
                        }) : <div style={{ border: '2px dashed #00a32a', padding: '10px', marginBottom: '10px' }}><h1>No Bookings</h1></div> : ""
                      }
                    </div>
                  </Card>
                </>

                : ""
            }

          </div>
        </div>
        {/* <Card> */}
        {/* <CardHeader style={{ display: "block" }}>
            <h3 style={{ color: 'green' }}>Hi {userDetails.firstName}</h3>
          </CardHeader> */}
        {/* <CardBody>
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
          </CardBody> */}
        {/* </Card> */}
      </div>
    </div>
  );
}
