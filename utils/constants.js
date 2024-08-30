import { postApi } from '../app/response/api';
import store from './store'
import moment from "moment";

export const getDateTimeInput = async (name, val) => {
    if (name.includes("DATE")) {
        let monthVal = new Date(val)?.getMonth() + 1
        let dayVal = new Date(val)?.getDate()
        const month = monthVal?.toString()?.length == 1 ? `0${monthVal}` : monthVal.toString()
        const day = dayVal?.toString().length == 1 ? `0${dayVal}` : dayVal.toString()
        const newDate = `${month}/${day}/${new Date(val).getFullYear()}`
        store.dispatch({ type: name, payload: newDate })
        return newDate
    } else {
        store.dispatch({ type: name, payload: val })
        return val
    }
}

export const mobilePattern = /^\d{10}$/;
export const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

export const TimeRangeArr = ["12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 PM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
]
export const addDays = (days) => {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return dateFormatter(result);
}

export const dateFormatter = (str) => {
    const date = new Date(str ? str : "")
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month.toString().length == 1 ? `0${month}` : month}/${day.toString().length == 1 ? `0${day}` : day}/${year}`
}

export const dispatchFunction = async (obj) => {
    const dispatch = store.dispatch
    const { filterString, startTime, startDate, endDate, endTime, disabledKeys, citiesData, selectedCity, selectedLocality, loginData } = obj
    dispatch({ type: "SELECTEDLOCALITY", payload: selectedLocality })
    dispatch({ type: "DEFAULTPICKUPLOCATION", payload: selectedLocality })
    dispatch({ type: "CITIESDATA", payload: citiesData })
    dispatch({ type: "LOGINDATA", payload: loginData })
    dispatch({ type: "ISLOGGEDIN", payload: loginData ? true : false })
    dispatch({ type: "FILTERSTRING", payload: filterString })
    dispatch({ type: "STARTTIME", payload: startTime })
    dispatch({ type: "STARTDATE", payload: startDate })
    dispatch({ type: "ENDDATE", payload: endDate })
    dispatch({ type: "ENDTIME", payload: endTime })
    dispatch({ type: "DISABLEDKEYS", payload: disabledKeys })
    dispatch({ type: "SELECTEDCITY", payload: selectedCity })
    dispatch({ type: "LOADING", payload: false })
}

export const defaultVals = "Please select the nearby location"

export const apiCall = async () => {
    const dispatch = store.dispatch
    const { filterString, triggerApi } = store.getState()
    if (Object.keys(filterString).length && isValid() && triggerApi) {
        dispatch({ type: "LOADING", payload: true })
        const result = await postApi('/searchVehicle', filterString)
        if (result) {
            dispatch({ type: "VEHICLADATA", payload: result.data })
        }
        dispatch({ type: "LOADING", payload: false })
    }
}

export const sortArr = [{ key: "Please select sort type", label: "Please select sort type" }, { key: "lowToHigh", label: "From low to high" }, { key: "highToLow", label: "From high to low" }]


export const checkSoldOut = (BookingStartDateAndTime, BookingEndDateAndTime) => {
    const getEndDate = store.getState().endDate
    const getEndTime = store.getState().endTime
    const getStartDate = store.getState().startDate
    const getStartTime = store.getState().startTime
    let soldOut = false
    if (BookingStartDateAndTime && BookingEndDateAndTime) {
        const { startDate, startTime } = BookingStartDateAndTime
        const { endDate, endTime } = BookingEndDateAndTime
        let bookingStartDate = moment(startDate).add(startTime.hours, 'hours').add(startTime.minutes, 'minutes')
        bookingStartDate = new Date(bookingStartDate.format()).getTime()
        let currentStartDate = moment(getStartDate).add(getStartTime.hours, 'hours').add(getStartTime.minutes, 'minutes')
        currentStartDate = new Date(currentStartDate.format()).getTime()
        let currentEndDate = moment(getEndDate).add(getEndTime.hours, 'hours').add(getEndTime.minutes, 'minutes')
        currentEndDate = new Date(currentEndDate.format()).getTime()
        let bookingEndDate = moment(endDate).add(endTime.hours, 'hours').add(endTime.minutes, 'minutes')
        bookingEndDate = new Date(bookingEndDate.format()).getTime()
        if (currentStartDate <= bookingStartDate && currentEndDate >= bookingStartDate) {
            soldOut = true
        } else if (currentStartDate >= bookingStartDate && currentEndDate <= bookingEndDate) {
            soldOut = true
        } else if (currentStartDate >= bookingStartDate && currentStartDate <= bookingEndDate) {
            soldOut = true
        } else {
            soldOut = false
        }
    } else {
        soldOut = false
    }
    store.dispatch({ type: "SOLDOUT", payload: soldOut })
}

// export const isValid = () => {
//     let isError = false
//     const { startTime, endTime, startDate, endDate } = store.getState()
//     const dispatch = store.dispatch
//     if (!startDate) {
//         isError = true
//         dispatch({ type: "ERROR", payload: { type: 'startDate', msg: "Please select the start date" } })
//     } else if (!startTime) {
//         isError = true
//         store.dispatch({ type: "ERROR", payload: { type: 'startTime', msg: "Please select the start time" } })
//     } else if (startTime) {
//         let momStartTime = moment(startTime, "hh:mm A");
//         let momEndTime = moment(endTime, "hh:mm A");
//         const selectedTime = new Date(momStartTime).getHours() * 60 + new Date(momStartTime).getMinutes()
//         const currentTime = new Date().getHours() * 60 + new Date().getMinutes()
//         if (selectedTime < currentTime) {
//             isError = true
//             dispatch({ type: "ERROR", payload: { type: 'startTime', msg: "Please select the valid start time" } })
//         } else if (!endDate) {
//             isError = true
//             dispatch({ type: "ERROR", payload: { type: 'endDate', msg: "Please select the end date" } })
//         } else if (endDate) {
//             const date1 = new Date(startDate);
//             const date2 = new Date(endDate);
//             const diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
//             if (diffDays < 0) {
//                 isError = true
//                 dispatch({ type: "ERROR", payload: { type: 'endDate', msg: "Please select the valid end date" } })
//             } else if (!endTime) {
//                 isError = true
//                 dispatch({ type: "ERROR", payload: { type: 'endTime', msg: "Please select the end time" } })
//             } else if (endTime) {
//                 if (startDate == endDate) {
//                     const expectedTime = new Date(momStartTime).getHours() + new Date(momStartTime).getMinutes() / 60 + 4
//                     const selectedTime = new Date(momEndTime).getHours() + new Date(momEndTime).getMinutes() / 60
//                     if (selectedTime < expectedTime) {
//                         isError = true
//                         dispatch({ type: "ERROR", payload: { type: 'endTime', msg: "Please select the valid end time" } })
//                     } else {
//                         isError = false
//                         dispatch({ type: "ERROR", payload: "" })
//                     }
//                 } else {
//                     isError = false
//                     dispatch({ type: "ERROR", payload: "" })
//                 }
//             }
//         }
//     }
//     if (isError) {
//         return false
//     } else {
//         return true
//     }
// }

export const isValid = () => {
    let isError = false
    const { startTime, endTime, startDate, endDate } = store.getState()
    const dispatch = store.dispatch
    if (!startDate) {
        isError = true
        dispatch({ type: "ERROR", payload: { type: 'startDate', msg: "Please select the start date" } })
    } else if (!startTime) {
        isError = true
        store.dispatch({ type: "ERROR", payload: { type: 'startTime', msg: "Please select the start time" } })
    } else if (!endDate) {
        isError = true
        store.dispatch({ type: "ERROR", payload: { type: 'endDate', msg: "Please select the end date" } })
    } else if (endDate) {
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        const diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
        if (diffDays < 0) {
            isError = true
            dispatch({ type: "ERROR", payload: { type: 'endDate', msg: "Please select the valid end date" } })
        } else if (!endTime) {
            isError = true
            dispatch({ type: "ERROR", payload: { type: 'endTime', msg: "Please select the end time" } })
        } else if (endTime) {
            if (startDate == endDate) {
                let momStartTime = moment(startTime, "hh:mm A");
                let momEndTime = moment(endTime, "hh:mm A");
                const expectedTime = new Date(momStartTime).getHours() + new Date(momStartTime).getMinutes() / 60  + .5
                const selectedTime = new Date(momEndTime).getHours() + new Date(momEndTime).getMinutes() / 60
                if (selectedTime < expectedTime) {
                    isError = true
                    dispatch({ type: "ERROR", payload: { type: 'endTime', msg: "Please select the valid end time" } })
                } else {
                    isError = false
                    dispatch({ type: "ERROR", payload: "" })
                }
            } else {
                isError = false
                dispatch({ type: "ERROR", payload: "" })
            }
        }
    }    
    if (isError) {
        return false
    } else {
        return true
    }
}

export const brands = [
    { value: "Please choose brand", label: "Please choose brand" },
    { key: "bajaj", label: "Bajaj" },
    { key: "yahama", label: "Yamaha" },
    { key: "royal enfield", label: "Royal Enfield" },
    { key: "honda", label: "Honda" }
]
export const categories = [
    { name: "Scooty", url: "https://rentelo-production.s3.ap-south-1.amazonaws.com/models/1692192778477-000000-scooter.svg" },
    { name: "Bike", url: "https://rentelo-production.s3.ap-south-1.amazonaws.com/models/1695016773054-000000-Cruser.svg" }
]