'use client'
import { CitiesModal } from "../utils/modal";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getApi } from './response/api';
import { dispatchFunction, isValid, TimeRangeArr } from "../utils/constants";
import { parseDate } from "@internationalized/date";
import { DatePickerComponent, DateSelection, Loading, TimerSelection } from "../components/commonComponents";
import { getLocalTimeZone, today } from "@internationalized/date";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.min.css';
import { DateIcon, LockIcon } from "../utils/icons";

const arrrr = ["12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 PM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
]

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = date => {
    setSelectedDate(date);
  };
  const { selectedCity, loading, disabledKeys, startTime, endTime, location, startDate, endDate, filterString } = useSelector(state => state)

  useEffect(() => {
    (async () => {
      let initialData = localStorage.getItem('loginData')
      if (initialData) {
        initialData = JSON.parse(initialData)
      }
      const response = await getApi('/getLocations')
      if (response && response.data) {
        let arr = []
        for (let i = 0; i < TimeRangeArr.length; i++) {
          let isDisabled = false
          let rs = TimeRangeArr[i]
          let time = moment(rs, "hh:mm A");
          let time1 = new Date(time).getTime()
          let time2 = new Date().getTime()
          if (time1 < time2) {
            isDisabled = true
            arr.push(TimeRangeArr[i]) 
          }
        }
        let lastVal = arr[arr.length - 1]
        const index = TimeRangeArr.findIndex((ele) => ele == lastVal)
        let getStartTime = arrrr[index + 1]
        let getStartDate = moment(new Date()).format('MM/DD/YYYY')
        let getEndDate = moment(new Date()).add(1, 'days').format('MM/DD/YYYY')
        let getEndTime = getStartTime
        const filterObj = { pickupLocation: response.data[0].subLocation[1].label, location: response.data[0].myLocation, startDate: getStartDate, startTime: getStartTime, endDate: getEndDate, endTime: getEndTime, sort: "lowToHigh" }
        const obj = { loginData: initialData, selectedLocality: response.data[0].subLocation[1].label, filterString: filterObj, startTime: getStartTime, startDate: getStartDate, endDate: getEndDate, endTime: getEndTime, disabledKeys: arr, citiesData: response.data, selectedCity: response.data[0] }
        await dispatchFunction(obj)
      }
    })()

    const date = moment("27 July, 2024", "D MMMM, YYYY");
    if (date.isValid()) {
      // Formatting the date
      const formattedDate = date.format('D MMMM, YYYY');
      console.log(formattedDate);
    }
  }, [])
  const search = async () => {
    if (isValid()) {
      const obj = { selectedCity, loading, disabledKeys, startTime, endTime, location, startDate, endDate, filterString }
      //localStorage.setItem('initialData', JSON.stringify(obj))
      dispatch({ type: "TRIGGERAPI", payload: true })
      router.push('/dashboard')
    }
  }
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
              <div style={{ padding: "60px 61px 90px 117px", fontWeight: "bold" }}>
                <p style={{ fontSize: "30px" }}>Commuting Made <span style={{ color: '#e03546' }}>Easy</span>,</p>
                <p style={{ fontSize: "30px" }}><span style={{ color: '#e03546' }}>Affordable</span> and <span style={{ color: '#e03546' }}>Quick</span></p>
                <p style={{ fontSize: "20px" }}>Scooter/Scooty/Bike on Rent in Bangalore</p>
                <div className="w-full flex flex-col gap-4">
                </div>
                <div style={{ marginBottom: '30px' }} className="flex flex-col gap-4">
                  <div className='row'>
                    <div className='col-md-6'>
                      <DateSelection type={'STARTDATE'} />
                      {/* <DatePickerComponent defaultVal={today(getLocalTimeZone())} type={'STARTDATE'} errType={'startDate'} label={'Start Date'} /> */}
                    </div>
                    <div className='col-md-6' style={{ alignContent: 'right' }}>
                      <TimerSelection type={'STARTTIME'} errType={'startTime'} label={'Start Time'} />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                    <DateSelection type={'ENDDATE'} />
                    </div>
                    <div className='col-md-6' style={{ alignContent: 'right' }}>
                      <TimerSelection type={'ENDTIME'} errType={'endTime'} label={'End Time'} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <p>Duration: 1 Day</p>
                </div>
                <button style={{ width: '100%', background: 'black' }} onClick={search} type="submit" className="btn btn-success btn-block form-control">Search</button>
              </div> : ""
          }

        </div>
        <div className="col-md-6">
          <img
            src={selectedCity?.url}
            alt="Picture of the selected city"
            width={'100%'}
            height={'100%'}
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
