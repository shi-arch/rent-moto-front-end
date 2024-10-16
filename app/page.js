'use client'
import { CitiesModal } from "../utils/modal";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getApi } from './response/api';
import { dispatchFunction, initialCall, isValid, TimeRangeArr } from "../utils/constants";
import { getLocalStream } from '../app/constant'
import { parseDate } from "@internationalized/date";
import { DatePickerComponent, DateSelection, Loading, TimerSelection } from "../components/commonComponents";
import { getLocalTimeZone, today } from "@internationalized/date";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.min.css';
import { DateIcon, LockIcon } from "../utils/icons";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter()  
  const {totalTripDaysTime} = useSelector(state => state)
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = date => {
    setSelectedDate(date);
  };
  const { selectedCity, loading, disabledKeys, startTime, endTime, location, startDate, endDate, filterString, daysCount } = useSelector(state => state)

  useEffect(() => {
    getLocalStream()
  }, [filterString])

  useEffect(() => {
    (async () => {
      await initialCall()
    })()
    localStorage.removeItem("dashboardPage")
    localStorage.removeItem("detailPage")
  }, [])
  const search = async () => {
    if (isValid()) {
      const obj = { selectedCity, loading, disabledKeys, startTime, endTime, location, startDate, endDate, filterString }
      //localStorage.setItem('initialData', JSON.stringify(obj))
      dispatch({ type: "TRIGGERAPI", payload: true })
      router.push('/dashboard')
    }
  }
  // useEffect(() => {
  //   if (filterString.startTime) {
  //     let startTimeHours = new Date(moment(startTime, "hh:mm A")).getHours()
  //     let endTimeHours = new Date(moment(endTime, "hh:mm A")).getHours()
  //     let endTimeMins = new Date(moment(endTime, "hh:mm A")).getMinutes()
  //     let startTimeMins = new Date(moment(startTime, "hh:mm A")).getMinutes()
  //     let startDateHours = moment(startDate).add(startTimeHours, 'hours')
  //     let endDateHours = moment(endDate).add(endTimeHours, 'hours')
  //     var estHours = (endTimeHours - startTimeHours) + (endDateHours - startDateHours);
  //     let tripHrs = Math.trunc(estHours / 3600000)
  //     let minutes = startTimeMins && endTimeMins ? 0 : startTimeMins || endTimeMins
  //     dispatch({ type: "TOTALTRIPHOURS", payload: tripHrs })
  //     dispatch({ type: "TOTALTRIPDAYSTIME", payload: { days: Math.trunc(tripHrs / 24), hours: tripHrs % 24, mins: minutes} })
  //   }
  // }, [filterString])
  return (
    <>
      <div style={{ width: "100%" }} className="row">
        <CitiesModal closeCityModal={() => dispatch({ type: "CITIESTMODAL", payload: false })} />
        <div className="col-md-6">
          {
            loading ? <Loading /> : null
          }
          {
            startTime && endTime && disabledKeys ?
              <div className="mobile-padding" style={{ padding: "60px 61px 90px 117px", fontWeight: "bold" }}>
                <p style={{ fontSize: "30px" }}>Commuting Made <span style={{ color: '#e03546' }}>Easy</span>,</p>
                <p style={{ fontSize: "30px" }}><span style={{ color: '#e03546' }}>Affordable</span> and <span style={{ color: '#e03546' }}>Quick</span></p>
                <p style={{ fontSize: "20px" }}>Scooter/Scooty/Bike on Rent in Bangalore</p>
                <div className="w-full flex flex-col gap-4">
                </div>
                <div style={{ marginBottom: '30px' }} className="flex flex-col gap-4">
                  <div className='row'>
                    <div className='col-md-6'>
                      <DatePickerComponent type={'STARTDATE'} />
                    </div>
                    <div className='col-md-6' style={{ alignContent: 'right' }}>
                      <TimerSelection type={'STARTTIME'} errType={'startTime'} label={'Start Time'} />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <DatePickerComponent type={'ENDDATE'} />
                    </div>
                    <div className='col-md-6' style={{ alignContent: 'right' }}>
                      <TimerSelection type={'ENDTIME'} errType={'endTime'} label={'End Time'} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <p>Duration: {daysCount} Day</p>
                </div>
                <button style={{ width: '100%', background: 'black' }} onClick={search} type="submit" className="btn btn-success btn-block form-control">Search</button>
              </div> : <Loading />
          }

        </div>
        <div className="col-md-6">
          <img
            className="imageCenter"
            src={selectedCity?.url}
            alt="Picture of the selected city"
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </>

  );
}

const CustomInput = ({ value, onClick, label }) => (
  <div style={{ cursor: 'pointer', padding: "5px 0px", border: "2px solid rgb(225 225 245)", borderRadius: "10px", boxShadow: "var(--bs-box-shadow-sm) !important" }}>
    <span style={{ display: 'block', fontSize: '13px', fontWeight: '400', marginLeft: '12px', fontWeight: "bold" }}>{label}</span>
    <div onClick={onClick} tabIndex="0" role="button" className="custom-input d-flex align-items-center container" >
      <button className="custom-input" style={{ fontWeight: '400', fontSize: '15px', color: "#797982" }}>
        {value}
      </button>
      <div style={{ marginLeft: '128px' }}>
        <DateIcon />
      </div>
    </div>
  </div>
);
