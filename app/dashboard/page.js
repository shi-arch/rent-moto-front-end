
'use client'
import { useEffect, useState } from 'react';
import './dashboard.css'
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { BikeCard, Loading, SubHeader, BookingDurationComp } from '../../components/commonComponents';
import { Select, SelectItem, useSelect } from "@nextui-org/select";
import { getApi, postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, brands, categories, defaultVal, dispatchFunction, initialCall, sortArr } from '../../utils/constants';
import { CitiesModal } from '../../utils/modal';
import { getLocalStream, durationArr } from '../../app/constant'
import { Button } from '@nextui-org/button';
import moment from 'moment';

export default function Page() {
  const dispatch = useDispatch()
  const data = useSelector(state => state.vehicleData)
  const selectedCity = useSelector(state => state.selectedCity)
  const loading = useSelector(state => state.loading)
  const defaultPickupLocation = useSelector((state) => state.defaultPickupLocation);
  const filterString = useSelector(state => state.filterString)
  const defaultBrand = useSelector(state => state.defaultBrand)
  const defaultPrice = useSelector(state => state.defaultPrice)
  const filterData = useSelector(state => state.filterData)
  const vehicleName = useSelector(state => state.vehicleName)
  const triggerApi = useSelector(state => state.triggerApi)
  const { initialFilter, bookingDurationList, totalTripHours, selectedLocality } = useSelector(state => state)
  const { startDate, endDate, startTime, endTime } = useSelector(state => state.filterString)
  const [isFilter, setIsFilter] = useState(false)

  useEffect(() => {
    let checkData = localStorage.getItem("dashboardPage")
    localStorage.removeItem("detailPage")
    if(checkData){
      let data = JSON.parse(checkData)
      dispatch({type: "FILTERSTRING", payload: data.filterString})
      dispatch({type: "SELECTEDCITY", payload: data.selectedCity})
      dispatch({type: "SELECTEDLOCALITY", payload: data.selectedLocality})      
    } else {
      localStorage.setItem("dashboardPage", JSON.stringify({filterString, selectedCity, selectedLocality}))     
    }
  }, [])

  useEffect(() => {
    getLocalStream()
  }, [filterString])

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        dispatch({ type: "LOADING", payload: false })
      }, 3000)
    }
  }, [loading])

  useEffect(() => {
    if (data && data.length) {
      setIsFilter(true)
      dispatch({ type: "LOADING", payload: false })
    }
  }, [data])


  useEffect(() => {
    (async () => {
      console.log(filterString)
      //await initialCall()
      const response = await getApi("/getAllBookingDuration")
      if (response && response.data) {
        dispatch({ type: "BOOKINGDURATIONLIST", payload: response.data })
      }
    })()
  }, [])

  useEffect(() => {
    if (filterString.startTime) {
      let startTimeHours = new Date(moment(startTime, "hh:mm A")).getHours()
      let endTimeHours = new Date(moment(endTime, "hh:mm A")).getHours()
      let endTimeMins = new Date(moment(endTime, "hh:mm A")).getMinutes()
      let startTimeMins = new Date(moment(startTime, "hh:mm A")).getMinutes()
      let startDateHours = moment(startDate).add(startTimeHours, 'hours')
      let endDateHours = moment(endDate).add(endTimeHours, 'hours')
      var estHours = (endTimeHours - startTimeHours) + (endDateHours - startDateHours);
      let tripHrs = Math.trunc(estHours / 3600000)
      let minutes = startTimeMins && endTimeMins ? 0 : startTimeMins || endTimeMins
      dispatch({ type: "TOTALTRIPHOURS", payload: tripHrs })
      dispatch({ type: "TOTALTRIPDAYSTIME", payload: { days: Math.trunc(tripHrs / 24), hours: tripHrs % 24, mins: minutes} })
    }
  }, [filterString])

  useEffect(() => {
    (async () => {
      await apiCall()
      if (!triggerApi) {
        dispatch({ type: "TRIGGERAPI", payload: true })
      }
    })()
  }, [filterString.location])

  const filter = async (clear) => {
    let str = filterString
    if (clear == 'clear') {
      str = { location: selectedCity.myLocation }
      dispatch({ type: "FILTERSTRING", payload: initialFilter })
      dispatch({ type: "DEFAULTBRAND", payload: defaultBrand })
      dispatch({ type: "DEFAULTPRICE", payload: defaultPrice })
      dispatch({ type: "DEFAULTPICKUPLOCATION", payload: initialFilter.pickupLocation })
      dispatch({ type: "SELECTEDKEYS", payload: defaultPickupLocation })
      dispatch({ type: "VEHICLENAME", payload: "" })
      dispatch({ type: "FILTERDATA", payload: "" })
    }
  }

  const setFilter = async (name) => {
    console.log()
    let cloneData = JSON.parse(JSON.stringify(filterString))
    if (name == "Scooty") {
      cloneData.transmissionType = "non gear"
    } else if (name == "Bike") {
      cloneData.transmissionType = "gear"
    }
    dispatch({ type: "FILTERDATA", payload: name })
    dispatch({ type: "FILTERSTRING", payload: cloneData })
  }

  const closeCityModal = () => {
    dispatch({ type: "CITIESTMODAL", payload: false })
  }

  return (
    <div className='container'>
      {
        loading ? <Loading /> : ""
      }
      <SubHeader />
      < CitiesModal closeCityModal={closeCityModal} />
      <div className='row'>
        <div className='col-md-3 hide'>
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <h4 style={{ marginBottom: "20px" }}>FILTER</h4>
            <Card className="max-w-[400px]" >
              <CardHeader className="flex gap-3">Categories</CardHeader>
              <CardBody>
                <div className='row'>
                  {
                    categories.map((ele) => (
                      <div className='col-md-6 col-sm-6 col-xs-6' key={ele.name} style={{ marginBottom: "15px" }}>
                        <div tabIndex="0" role="button" onClick={() => setFilter(ele.name)} className={filterData == ele.name ? "filter" : ""} style={{ border: '1px solid #d3d3da', borderRadius: "10px", textAlign: "center", padding: "22px 0px", cursor: "pointer", height: "100px" }}>
                          <img style={ele.name == "Scooty" ? { width: "60px", margin: "0px auto" } : { width: "80px", margin: "0px auto" }} src={ele.url} alt="Picture of my category" />
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>{ele.name}</span>
                        </div>
                      </div>
                    ))
                  }
                  <div>
                    <button className="form-controll" onClick={() => {
                      const filter = { ...filterString, mostBooked: true }
                      dispatch({ type: "FILTERSTRING", payload: filter })
                    }} style={{ width: "100%", background: "black", color: "white", padding: "10px 0px", borderRadius: "5px" }}>Most booked vehicles</button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardBody>
                <h5>BOOKING DURATION</h5>
                {
                  bookingDurationList && bookingDurationList.length ? bookingDurationList.map((ele) => (
                    <BookingDurationComp isChecked={false} onChecked={() => {
                      console.log(filterString)
                      const { startTime, startDate } = filterString
                      let bookingStartHours = new Date(moment(startTime, "hh:mm A")).getHours()
                      let bookingStartMinutes = new Date(moment(startTime, "hh:mm A")).getMinutes()
                      let bookingStartDate = ""
                      let amount = 0
                      if (ele.bookingDuration.label == "Weekly Package") {
                        bookingStartDate = moment(startDate).add(7, 'days').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                        amount = 12000
                      } else if (ele.bookingDuration.label == "3 Hours Package") {
                        bookingStartDate = moment(startDate).add(bookingStartHours + 3, 'hours').add(bookingStartMinutes, 'minutes')
                        amount = 6000
                      } else if (ele.bookingDuration.label == "6 Hours Package") {
                        amount = 8000
                        bookingStartDate = moment(startDate).add(bookingStartHours + 6, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Half Day Package") {
                        amount = 9000
                        bookingStartDate = moment(startDate).add(bookingStartHours + 12, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Daily Package") {
                        amount = 10000
                        bookingStartDate = moment(startDate).add(1, 'day').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "15 Days Package") {
                        amount = 16000
                        bookingStartDate = moment(startDate).add(15, 'days').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Monthly Package") {
                        amount = 30000
                        bookingStartDate = moment(startDate).add(1, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "3 Months Package") {
                        amount = 90000
                        bookingStartDate = moment(startDate).add(3, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "6 Months Package") {
                        amount = 100000
                        bookingStartDate = moment(startDate).add(6, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Yearly Package") {
                        amount = 170000
                        bookingStartDate = moment(startDate).add(1, 'year').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      }
                      dispatch({
                        type: "FILTERSTRING", payload: {
                          ...filterString, bookingDuration: ele.bookingDuration.label, selectedAmount: amount,
                          endDate: moment(bookingStartDate).format('MM/DD/YYYY'), endTime: moment(bookingStartDate).format('hh:mm A')
                        }
                      })
                      //dispatch({type: "FILTERSTRING", payload: ele.bookingDuration})                      
                    }} label={ele.bookingDuration.label} />
                  )) : ""
                }
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardHeader className="flex gap-3">Choose Brand</CardHeader>
              <CardBody>
                <select style={{ height: "57px" }} className="form-select" defaultValue={defaultBrand} onChange={async (e) => {
                  const {value} = e.target
                  let o = value
                  if(value == "Please choose brand"){
                    o = ""
                  }
                  dispatch({ type: "SELECTEDKEYS", payload: o })
                  const filter = { ...filterString, brand: o }
                  dispatch({ type: "FILTERSTRING", payload: filter })
                  dispatch({ type: "DEFAULTBRAND", payload: o })
                }} name="cars" id="brands">
                  {
                    brands.map((o) => (
                      <option key={o.label} value={o.key}>{o.label}</option>
                    ))
                  }
                </select>
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardHeader className="flex gap-3">Price sort</CardHeader>
              <CardBody>
                <select style={{ height: "57px" }} className="form-select" defaultValue={defaultPrice} onChange={async (e) => {
                  const o = e.target.value
                  dispatch({ type: "SELECTEDKEYS", payload: o })
                  const filter = { ...filterString, sort: o }
                  dispatch({ type: "FILTERSTRING", payload: filter })
                }}>
                  {
                    sortArr.map((o) => (
                      <option key={o.label} value={o.key}>{o.label}</option>
                    ))
                  }
                </select>
              </CardBody>
            </Card>
            <button style={{ width: '100%', margin: "20px 0px", background: "#e03546", border: "none" }} onClick={() => filter('clear')} type="submit" className="btn btn-success btn-block form-control">Reset filter</button>
          </div>
        </div>
        <div className='col-md-9'>
          <div className='row' style={{ textAlign: "center", marginBottom: "20px" }}>
            {
              data && data.length ? data.map((card, index) => {
                let finalCharge = ""
                if (filterString.selectedAmount) {
                  finalCharge = filterString.selectedAmount
                } else {
                  let dayCountMult = card.pricePerday
                  if (totalTripHours > 24) {
                    dayCountMult = Math.trunc(totalTripHours / 24) * card.pricePerday
                    if (totalTripHours % 24 > 0) {
                      dayCountMult = (Math.trunc(totalTripHours / 24) + 1) * card.pricePerday
                    }
                  }
                  finalCharge = dayCountMult
                }
                return <div key={index} className='col-md-4'>
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <BikeCard key={index} {...card} finalCharge={finalCharge} />
                  </div>
                </div>
              }) : <h1 style={{ marginTop: "45px" }}>{isFilter ? 'Sorry ... ! No vehicle found' : ''}</h1>
            }
          </div>
        </div>
        <div style={{display: 'none'}} className='col-md-3 mobile-filter'>
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <h4 style={{ marginBottom: "20px" }}>FILTER</h4>
            <Card className="max-w-[400px]" >
              <CardHeader className="flex gap-3">Categories</CardHeader>
              <CardBody>
                <div className='row'>
                  {
                    categories.map((ele) => (
                      <div className='col-md-6 col-sm-6 col-xs-6' key={ele.name} style={{ marginBottom: "15px" }}>
                        <div tabIndex="0" role="button" onClick={() => setFilter(ele.name)} className={filterData == ele.name ? "filter" : ""} style={{ border: '1px solid #d3d3da', borderRadius: "10px", textAlign: "center", padding: "22px 0px", cursor: "pointer", height: "100px" }}>
                          <img style={ele.name == "Scooty" ? { width: "60px", margin: "0px auto" } : { width: "80px", margin: "0px auto" }} src={ele.url} alt="Picture of my category" />
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>{ele.name}</span>
                        </div>
                      </div>
                    ))
                  }
                  <div>
                    <button className="form-controll" onClick={() => {
                      const filter = { ...filterString, mostBooked: true }
                      dispatch({ type: "FILTERSTRING", payload: filter })
                    }} style={{ width: "100%", background: "black", color: "white", padding: "10px 0px", borderRadius: "5px" }}>Most booked vehicles</button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardBody>
                <h5>BOOKING DURATION</h5>
                {
                  bookingDurationList && bookingDurationList.length ? bookingDurationList.map((ele) => (
                    <BookingDurationComp isChecked={false} onChecked={() => {
                      console.log(filterString)
                      const { startTime, startDate } = filterString
                      let bookingStartHours = new Date(moment(startTime, "hh:mm A")).getHours()
                      let bookingStartMinutes = new Date(moment(startTime, "hh:mm A")).getMinutes()
                      let bookingStartDate = ""
                      let amount = 0
                      if (ele.bookingDuration.label == "Weekly Package") {
                        bookingStartDate = moment(startDate).add(7, 'days').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                        amount = 12000
                      } else if (ele.bookingDuration.label == "3 Hours Package") {
                        bookingStartDate = moment(startDate).add(bookingStartHours + 3, 'hours').add(bookingStartMinutes, 'minutes')
                        amount = 6000
                      } else if (ele.bookingDuration.label == "6 Hours Package") {
                        amount = 8000
                        bookingStartDate = moment(startDate).add(bookingStartHours + 6, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Half Day Package") {
                        amount = 9000
                        bookingStartDate = moment(startDate).add(bookingStartHours + 12, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Daily Package") {
                        amount = 10000
                        bookingStartDate = moment(startDate).add(1, 'day').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "15 Days Package") {
                        amount = 16000
                        bookingStartDate = moment(startDate).add(15, 'days').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Monthly Package") {
                        amount = 30000
                        bookingStartDate = moment(startDate).add(1, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "3 Months Package") {
                        amount = 90000
                        bookingStartDate = moment(startDate).add(3, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "6 Months Package") {
                        amount = 100000
                        bookingStartDate = moment(startDate).add(6, 'month').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "Yearly Package") {
                        amount = 170000
                        bookingStartDate = moment(startDate).add(1, 'year').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      }
                      dispatch({
                        type: "FILTERSTRING", payload: {
                          ...filterString, bookingDuration: ele.bookingDuration.label, selectedAmount: amount,
                          endDate: moment(bookingStartDate).format('MM/DD/YYYY'), endTime: moment(bookingStartDate).format('hh:mm A')
                        }
                      })
                      //dispatch({type: "FILTERSTRING", payload: ele.bookingDuration})                      
                    }} label={ele.bookingDuration.label} />
                  )) : ""
                }
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardHeader className="flex gap-3">Choose Brand</CardHeader>
              <CardBody>
                <select style={{ height: "57px" }} className="form-select" defaultValue={defaultBrand} onChange={async (e) => {
                  const {value} = e.target
                  let o = value
                  if(value == "Please choose brand"){
                    o = ""
                  }
                  dispatch({ type: "SELECTEDKEYS", payload: o })
                  const filter = { ...filterString, brand: o }
                  dispatch({ type: "FILTERSTRING", payload: filter })
                  dispatch({ type: "DEFAULTBRAND", payload: o })
                }} name="cars" id="brands">
                  {
                    brands.map((o) => (
                      <option key={o.label} value={o.key}>{o.label}</option>
                    ))
                  }
                </select>
              </CardBody>
            </Card>
            <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardHeader className="flex gap-3">Price sort</CardHeader>
              <CardBody>
                <select style={{ height: "57px" }} className="form-select" defaultValue={defaultPrice} onChange={async (e) => {
                  const o = e.target.value
                  dispatch({ type: "SELECTEDKEYS", payload: o })
                  const filter = { ...filterString, sort: o }
                  dispatch({ type: "FILTERSTRING", payload: filter })
                }}>
                  {
                    sortArr.map((o) => (
                      <option key={o.label} value={o.key}>{o.label}</option>
                    ))
                  }
                </select>
              </CardBody>
            </Card>
            <button style={{ width: '100%', margin: "20px 0px", background: "#e03546", border: "none" }} onClick={() => filter('clear')} type="submit" className="btn btn-success btn-block form-control">Reset filter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
