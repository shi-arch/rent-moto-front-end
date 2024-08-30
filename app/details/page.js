
'use client'
import { useEffect, useState } from 'react';
import './dashboard.css'
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { BackIcon, DateIcon, LocateIcon, RouteIcon } from '../../utils/icons';
import { useRouter } from "next/navigation";
import { ClockIcon } from '@mui/x-date-pickers';
import moment from 'moment';
import swal from 'sweetalert';
import { Loading } from '../../components/commonComponents';
import { Input } from '@nextui-org/input';
import { PaymentModal } from '../../utils/modal';

export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { name, url, pricePerday, vehicleNumber, _id, vehicleCount, vehicleId, pickupLocation, location, brand, bookingCount, accessChargePerKm, distanceLimit, transmissionType } = useSelector(state => state.selectedVehicle)
  const { myLocation } = useSelector(state => state.selectedCity)
  const { startDate, endDate, startTime, endTime, selectedLocality, filterString, loading, loginData } = useSelector(state => state)
  const [cgst, setCgst] = useState(0)
  const [vehicleRentalCost, setVehicleRentalCost] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const { paymentMethod } = useSelector((state) => state);
  const [licenceCheck, setLicenceCheck] = useState(false)
  const [ageCheck, setAgeCheck] = useState(false)
  const [hours, setHours] = useState(0)
  const [pricePerDayCal, setPricePerDayCal] = useState(false)
  const [invoice, setInvoice] = useState("")

  useEffect(() => {
    if(pricePerDayCal && vehicleRentalCost){
      let price = vehicleRentalCost * 0.14
      setCgst(price.toFixed())
      let total = parseInt(vehicleRentalCost) + price * 2
      setTotalAmount(total.toFixed())
    }    
  }, [pricePerDayCal])

  useEffect(() => {
    let startTimeHours = new Date(moment(startTime, "hh:mm A")).getHours()
    let endTimeHours = new Date(moment(endTime, "hh:mm A")).getHours()
    let startDateHours = moment(startDate).add(startTimeHours, 'hours')
    let endDateHours = moment(endDate).add(endTimeHours, 'hours')
    var estHours = (endTimeHours - startTimeHours) + (endDateHours - startDateHours);
    let settingHours = Math.trunc(estHours / 3600000)
    setHours(settingHours)
    let dayCountMult = pricePerday
    if(settingHours > 24){
      dayCountMult = Math.trunc(settingHours / 24) * pricePerday
      if(settingHours % 24 > 0){
        dayCountMult = (Math.trunc(settingHours / 24) + 1) * pricePerday
      }      
    }
    setVehicleRentalCost(dayCountMult)
    setPricePerDayCal(true)
    if (loginData) {
      let loginStr = loginData
      let str = "Hi " + loginStr.firstName + " " + "your booking for " + loginStr.email + " " + "is successfully completed for " + name + ". " + "Your booking id is " + _id
      setInvoice(str)
    }
  }, [])


  const payNow = async () => {
    if (!paymentMethod) {
      dispatch({ type: "SHOWPAYMODEL", payload: true })
    } else {
      await makePayment()
    }
  }

  const updatePaybleAmount = (e) => {
    const { checked } = e.target
    let amt = JSON.parse(totalAmount)
    if (checked) {
      setTotalAmount(amt + 50)
    } else {
      setTotalAmount(amt - 50)
    }
  }

  const makePayment = async () => {
    const isUserLoggedIn = localStorage.getItem('loginData')
    if (isUserLoggedIn) {
      const contact = loginData.contact
      dispatch({ type: "LOADING", payload: true })
      const obj = {
        contact,
        vehicleId,
        BookingStartDateAndTime: {
          startDate: startDate,
          startTime: startTime
        },
        BookingEndDateAndTime: {
          endDate: endDate,
          endTime: endTime
        },
        vehicleNumber,
        bookingAmount: totalAmount
      }
      const res = await postApi('/booking', obj)
      if (res) {
        const updatBookingObj = {
          bookingData: {BookingStartDateAndTime: obj.BookingStartDateAndTime, BookingEndDateAndTime: obj.BookingEndDateAndTime,
            bookingAmount: obj.bookingAmount, isBooked: true, vehicleNumber, vehicleId, pickupLocation, location, contact
          },
          vehicleData: {
            accessChargePerKm, bookingCount, brand, distanceLimit, pricePerday, transmissionType, url
          }
        }
        const getData = localStorage.getItem('loginData')
        if(getData){
          const data = JSON.parse(localStorage.getItem("loginData"))
          const cloneBooking = [...data.bookings]
          cloneBooking.push(updatBookingObj)
          data.bookings = cloneBooking
          localStorage.setItem("loginData", JSON.stringify(data))

        }
        const result = await postApi('/searchVehicle', filterString)
        if (result) {
          dispatch({ type: "VEHICLADATA", payload: result.data })
          dispatch({ type: "LOADING", payload: false })
          swal({
            title: "Congratulations!",
            text: "Your booking has been confirmed.",
            icon: "success",
            dangerMode: true,
          })
            .then(async () => {
              await postApi('/sendOtp', { email: loginData.email, invoice })
              const res = await postApi('/getUsersByContact', { contact: parseInt(loginData.contact) })
              if (res.status == 200) {
                debugger
                dispatch({ type: "LOGINDATA", payload: res.data })
              }
              router.push('/thankyou')
            });
        }
        dispatch({ type: "LOADING", payload: true })
      }
    } else {
      dispatch({ type: "ERROR", payload: "" })
      dispatch({ type: "SHOWLOGINMODEL", payload: true })
    }
    dispatch({ type: "SHOWPAYMODEL", payload: false })
  }

  return (
    <div className='container' style={{ marginTop: "20px" }}>
      {
        loading ? <Loading /> : null
      }
      <PaymentModal makePayment={makePayment} />
      <div className='row'>
        <div className='col-md-7'>
          <Card>
            <CardHeader style={{ display: "block" }}>
              <div style={{ display: "flex" }}>
                <div>
                  <div style={{ display: "flex" }}>
                    <div role="button" tabIndex="0" onClick={() => {
                      router.push('/dashboard')
                    }} style={{ margin: "8px 5px 0px 0px", cursor: "pointer" }}>
                      <BackIcon />
                    </div>
                    <h4>Booking Summary</h4>
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <h4>Price</h4>
                </div>
              </div>
            </CardHeader>
            <hr />
            <CardBody>
              <div className='row'>
                <div className='col-md-3'>
                  <img src={url} alt="Selected vehicle picture" />
                </div>
                <div className='col-md-6'>
                  <div style={{ display: "flex" }}>
                    <div>
                      <p style={{ fontWeight: "bold" }}>{name}</p>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex" }}>
                      <span style={{ fontWeight: "bold" }}>{vehicleCount}</span> <span style={{ marginLeft: "2px" }}>Left</span>
                    </div>
                    <h5 className="mobile-price" style={{ marginLeft: "auto", display: "none" }}>₹ {pricePerday}</h5>
                  </div>
                  <p style={{ display: "flex", marginLeft: "-10px" }}><LocateIcon />  <label htmlFor="name">Pickup location</label></p>
                  <p style={{ marginTop: "-15px", fontWeight: "bold", marginLeft: "40px", fontSize: "14px" }}>{selectedLocality}</p>
                  <div style={{ display: "flex" }}>
                    <div style={{ maxWidth: "fit-content" }}>
                      <div style={{ display: "flex", marginBottom: "10px" }}>
                        <DateIcon /> Pick-up
                      </div>
                      <Card>
                        <CardBody>
                          <p>{moment(startDate).format('D MMM, YYYY')}</p>
                          <span style={{ fontWeight: "bold" }}>{startTime}</span>
                        </CardBody>
                      </Card>
                    </div>
                    <div style={{ textAlign: "center", marginLeft: "auto" }}>
                      to
                    </div>
                    <div style={{ maxWidth: "fit-content", marginLeft: "auto" }}>
                      <div style={{ display: "flex", marginBottom: "10px" }}>
                        <DateIcon /> Drop-off
                      </div>
                      <Card>
                        <CardBody>
                          <p>{moment(endDate).format('D MMM, YYYY')}</p>
                          <span style={{ fontWeight: "bold" }}>{endTime}</span>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}>
                    <ClockIcon />  <label htmlFor="name" style={{ marginLeft: "15px" }}>Total booking duration in <span style={{ fontWeight: "bold" }}>{hours} Hours</span></label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <RouteIcon />  <label htmlFor="name">Free for <span style={{ fontWeight: "bold" }}>100 kms</span></label>
                  </div>
                  <p style={{ marginTop: "15px" }}>Vehicle number  <label htmlFor="name" style={{ fontWeight: "bold" }}>{vehicleNumber?.toUpperCase()}</label></p>
                </div>
                <div className='col-md-3 mobile-price-hide' style={{ textAlign: "right" }}>
                  <h5>₹ {pricePerday}</h5>
                </div>

              </div>
            </CardBody>
          </Card>
        </div>
        <div className='col-md-5'>
          <Card>
            <CardHeader style={{ display: "block" }}>
              <div className='row'>
                <div className='col-md-6'>
                  <h5>Subtotal</h5>
                </div>
              </div>
            </CardHeader>
            <hr />
            <CardBody>
              <p>Vehicle Rental Cost <label htmlFor="name" style={{ float: "right" }}>₹ {pricePerday}</label></p>
              <p>Total Booking Amount <label htmlFor="name" style={{ float: "right" }}>₹ {vehicleRentalCost}</label></p>
              <p>CGST (14% applied) <label htmlFor="name" style={{ float: "right" }}>₹ {cgst}</label></p>
              <p>SGST (14% applied) <label htmlFor="name" style={{ float: "right" }}>₹ {cgst}</label></p>
            </CardBody>
            <hr />
            <CardFooter style={{ display: "block" }}>
              <p style={{ marginBottom: "40px" }}>Payable Amount <label htmlFor="name" style={{ float: "right" }}>₹ {totalAmount}</label></p>
              <div style={{ background: "#ffeccc", margin: "-16px", padding: "13px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex" }}>
                    <input type='checkbox' onChange={(e) => updatePaybleAmount(e)} style={{ width: "18px" }} />
                    <span style={{ paddingLeft: "10px", paddingBottom: "4px", color: "#6d6b72", fontSize: "16px", fontWeight: "600" }}>Need Extra Helmet</span>
                  </div>
                  <p style={{ marginLeft: "25px", fontSize: "12px" }}>Extra cost ₹ 50 will apply for extra pillion rider helmet.</p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex" }}>
                    <input type='checkbox' style={{ width: "18px" }} />
                    <span style={{ paddingLeft: "10px", paddingBottom: "4px", color: "#6d6b72", fontSize: "16px", fontWeight: "600" }}>Need Mobile Holder</span>
                  </div>
                  <p style={{ marginLeft: "25px", fontSize: "12px" }}>No cost ₹ 0 will apply for extra mobile holder.</p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card style={{ marginTop: "20px" }}>
            <CardHeader style={{ display: "block" }}>
              <div style={{ background: "linear-gradient(90deg,#dc2b2f,#de4444,#de5858,#e87c7e,#e09b9c)", padding: "10px", color: "white", margin: "-16px" }}>
                <h5 style={{ padding: "8px" }}>Promo Codes</h5>
              </div>
            </CardHeader>
            <CardBody>
              <input type='text' style={{ padding: "10px" }} className='form-control' placeholder='Enter promo code here' />
            </CardBody>
          </Card>

          <Card style={{ margin: "20px 0px" }}>
            <CardBody>
              <div style={{ padding: "12px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex" }}>
                    <input type='checkbox' onChange={() => setAgeCheck(true)} style={{ width: "18px" }} />
                    <span style={{ paddingLeft: "10px", color: "#6d6b72", fontSize: "14px", fontWeight: "600" }}>Confirm you are above 18 years of age and you agree Terms &</span>
                  </div>
                  <span style={{ color: "#6d6b72", fontSize: "14px", fontWeight: "600" }}>Conditions</span>
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <input type='checkbox' style={{ width: "18px" }} onChange={() => setLicenceCheck(true)} />
                    <span style={{ paddingLeft: "10px", color: "#6d6b72", fontSize: "14px", fontWeight: "600" }}>The original Driving license needs to be submitted at the time</span>
                  </div>
                  <span style={{ color: "#6d6b72", fontSize: "14px", fontWeight: "600" }}>of pickup and the same will be returned at the </span>
                  <span style={{ color: "#6d6b72", fontSize: "14px", fontWeight: "600" }}>time of dropping the vehicle.</span>
                  <p style={{ color: "#6d6b72", fontSize: "14px", fontWeight: "600", margin: "20px 0px" }}>This vehicle has been reserved for 5 minutes. Complete your booking before expiry.</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <button disabled={!ageCheck || !licenceCheck} style={{ width: '100%', background: 'black', marginBottom: "50px" }} onClick={payNow} type="submit" className="btn btn-success btn-block form-control">Pay Now</button>
        </div>
      </div>
    </div>
  );
}
