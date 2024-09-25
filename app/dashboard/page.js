
'use client'
import { useEffect, useState } from 'react';
import './dashboard.css'
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { BikeCard, Loading, SubHeader, BookingDurationComp } from '../../components/commonComponents';
import { Select, SelectItem, useSelect } from "@nextui-org/select";
import { getApi, postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, brands, categories, defaultVal, dispatchFunction, sortArr } from '../../utils/constants';
import { CitiesModal } from '../../utils/modal';
import { getLocalStream, durationArr } from '../../app/constant'
import { Button } from '@nextui-org/button';
import moment from 'moment';

export default function Page() {
  const dispatch = useDispatch()
  const data = useSelector(state => state.vehicleData)
  const selectedCity = useSelector(state => state.selectedCity)
  const startDate = useSelector(state => state.startDate)
  const loading = useSelector(state => state.loading)
  const defaultPickupLocation = useSelector((state) => state.defaultPickupLocation);
  const endDate = useSelector(state => state.endDate)
  const filterString = useSelector(state => state.filterString)
  const defaultBrand = useSelector(state => state.defaultBrand)
  const defaultPrice = useSelector(state => state.defaultPrice)
  const filterData = useSelector(state => state.filterData)
  const vehicleName = useSelector(state => state.vehicleName)
  const triggerApi = useSelector(state => state.triggerApi)
  const { initialFilter, bookingDurationList } = useSelector(state => state)

  useEffect(() => {
    getLocalStream()
  }, [filterString])

  useEffect(() => {
    (async () => {
      const response = await getApi("/getAllBookingDuration")
      if (response && response.data) {
        dispatch({ type: "BOOKINGDURATIONLIST", payload: response.data })
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      await apiCall()
      if (!triggerApi) {
        dispatch({ type: "TRIGGERAPI", payload: true })
      }
    })()
  }, [filterData])
  
  const filter = async (clear) => {
    let str = filterString
    if (clear == 'clear') {
      str = { location: selectedCity.myLocation}
      defaultPickupLocation
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
    if (name == "Scooty") {
      filterString.transmissionType = "non gear"
    } else if (name == "Bike") {
      filterString.transmissionType = "gear"
    }
    dispatch({ type: "FILTERDATA", payload: name })
    dispatch({ type: "FILTERSTRING", payload: filterString })
  }

  useEffect(() => {
    if(filterString){
      //debugger
    }
  }, [filterString])

  return (
    <div className='container'>
      {
        loading ? <Loading /> : ""
      }
      <SubHeader />
      < CitiesModal />
      <div className='row'>
        <div className='col-md-3'>
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
              <CardHeader className="flex gap-3">
                <h5 style={{ fontSize: "19px" }}>Filters</h5>
              </CardHeader>
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
                      if (ele.bookingDuration.label == "Weekly Package") {
                        bookingStartDate = moment(startDate).add(1, 'week').add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
                      } else if (ele.bookingDuration.label == "3 Hours Package") {
                        bookingStartDate = moment(startDate).add(3, 'hours').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "6 Hours Package") {
                        bookingStartDate = moment(startDate).add(6, 'hours').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "Half Day Package") {
                        bookingStartDate = moment(startDate).add(12, 'hours').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "Daily Package") {
                        bookingStartDate = moment(startDate).add(24, 'hours').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "15 Days Package") {
                        bookingStartDate = moment(startDate).add(15, 'days').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "Monthly Package") {
                        bookingStartDate = moment(startDate).add(1, 'month').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "3 Months Package") {
                        bookingStartDate = moment(startDate).add(3, 'month').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "6 Months Package") {
                        bookingStartDate = moment(startDate).add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')                        
                      } else if (ele.bookingDuration.label == "Yearly Package") {
                        bookingStartDate = moment(startDate).add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')                        
                      }
                      const tee = {
                        ...filterString, bookingDuration: ele.bookingDuration.label,
                        endDate: moment(bookingStartDate).format('MM/DD/YYYY'), endTime: moment(bookingStartDate).format('hh:mm A')
                      }
                      debugger
                      dispatch({
                        type: "FILTERSTRING", payload: {
                          ...filterString, bookingDuration: ele.bookingDuration.label,
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
                  const o = e.target.value
                  dispatch({ type: "SELECTEDKEYS", payload: o })
                  const filter = { ...filterString, brand: o }
                  dispatch({ type: "FILTERSTRING", payload: filter })
                  dispatch({ type: "DEFAULTBRAND", payload: o })
                  //await vehicleData(filter)
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
            {/* <Card className="max-w-[400px]" style={{ marginTop: "20px" }}>
              <CardHeader className="flex gap-3">Search by name</CardHeader>
              <CardBody>
                <input type='text' value={vehicleName} className="form controll" onChange={async (e) => {
                  const { value } = e.target
                  const str = { ...filterString, name: value }
                  dispatch({ type: "FILTERSTRING", payload: str })
                  dispatch({ type: "VEHICLENAME", payload: value })
                }} style={{ padding: "11px" }} placeholder="Search by name" />
              </CardBody>
            </Card> */}
            <button style={{ width: '100%', margin: "20px 0px", background: "#e03546", border: "none" }} onClick={() => filter('clear')} type="submit" className="btn btn-success btn-block form-control">Reset filter</button>
          </div>

        </div>
        <div className='col-md-9'>
          <div className='row' style={{ textAlign: "center", marginBottom: "20px" }}>
            {
              data && data.length ? data.map((card, index) => {
                const finalCharge = card.pricePerday * .18 + parseInt(card.pricePerday)
                return <div key={index} className='col-md-4'>
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <BikeCard key={index} {...card} finalCharge={finalCharge} />
                  </div>
                </div>
              }) : <h1 style={{ marginTop: "45px" }}> Sorry ... ! No vehicle found</h1>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
