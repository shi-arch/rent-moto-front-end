'use client'
import { DatePicker } from "@nextui-org/date-picker";
//import DatePicker from "react-datepicker";
import { TimeInput } from "@nextui-org/date-input";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { postApi } from "../app/response/api";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Time, getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/dropdown";
import { apiCall, defaultVal, getDateTimeInput, isValid, TimeRangeArr } from "../utils/constants";
import { useRouter } from "next/navigation";
import SoldOutGif from '../utils/images/sold-out.gif'
import { Skeleton } from "@nextui-org/skeleton";
import Image from 'next/image'
import './commonComponent.css'
import { AddNoteIcon, Bookingicon, DateIcon, LogOut, ProfileBlackIcon, ProfileIcon, UserIcon } from "../utils/icons";
import { parse } from "path";

export const BikeCard = (props) => {
    const dispatch = useDispatch()
    const { name, url, pricePerday, vehicleCount, accessChargePerKm, finalCharge, bookingCount } = props
    const { selectedLocality, error, filterString, totalTripHours } = useSelector((state) => state);
    const router = useRouter()
    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div style={{ background: vehicleCount == 0 ? "orange" : "green", marginLeft: "-17px", padding: '6px 13px', borderRadius: "10px", borderBottomLeftRadius: "0px", borderTopLeftRadius: "0px" }}>
                    <span style={{ color: "white", fontSize: "14px" }}>{vehicleCount == 0 ? "Unavailable" : vehicleCount + " Left"}</span>
                </div>
                {
                    bookingCount ? <div><p style={{ color: "red" }}>Vehicle booked : {bookingCount} Times</p></div> : null
                }

            </CardHeader>
            <CardBody>
                <img src={url} style={{ width: "144px", height: "96px", margin: "0 auto" }} alt="Bike picture" />
                <div style={{ marginTop: "14px", display: "flex" }}>
                    <div style={{ fontWeight: "700", fontSize: "12px", height: "34px" }}>{name.toUpperCase()}</div>
                    <div style={{ textAlign: "right", fontSize: "14px", marginLeft: "auto", paddingLeft: "8px" }}>₹{finalCharge}/day</div>
                </div>
                <span style={{ marginTop: "14px", display: "flex" }}><img alt="Svg icon" src="https://www.rentelo.in/assets/images/icons/excess-km.svg" style={{ marginRight: "5px" }} />100 kms limit</span>
                <span style={{ fontSize: "13px" }}>(Extra charge ₹ {accessChargePerKm}/km + gst)</span>
                <hr style={{ marginTop: "14px 0px" }} />
                <div style={{ display: "flex" }}>
                    <div style={{ fontWeight: "700" }}>₹ {finalCharge}</div>
                    <div style={{ marginLeft: "auto" }}>
                        {
                            vehicleCount !== 0 ?
                                <button style={{ width: '100%', background: 'black' }} onClick={() => {
                                    dispatch({ type: "SELECTEDVEHICLE", payload: props })
                                    dispatch({ type: "TRIGGERAPI", payload: false })
                                    let sgst = finalCharge*.14
                                    dispatch({ type: "PAYMENTDETAILS", payload: {sgst, finalCharge, payableAmount: sgst*2 + JSON.parse(finalCharge)}})
                                    dispatch({ type: "FILTERSTRING", payload: { ...filterString, finalCharge: JSON.parse(finalCharge) } })
                                    router.push('/details')
                                }} type="submit" disabled={vehicleCount == 0 || error?.msg ? true : false || !selectedLocality} className="btn btn-success btn-block form-control">Rent Now</button> :
                                ""
                        }
                    </div>
                </div>
                <p>Pickup at <span style={{ color: "red" }}>{selectedLocality ? selectedLocality : " ..."}</span></p>
            </CardBody>
        </Card>
    )
}

export const SelectTimer = () => {
    return (
        <div>
            <div><label htmlFor="name">Start Time</label></div>
            <select onChange={() => { }}>
                {
                    TimeRangeArr.map((ele) => {
                        let isDisabled = false
                        let time = moment(ele, "hh:mm A");
                        let time1 = new Date(time).getTime()
                        let time2 = new Date().getTime()
                        if (time1 < time2) {
                            isDisabled = true
                        }
                        return <option key={ele} disabled={isDisabled} value={ele}>{ele}</option>
                    })
                }
            </select>
        </div>

    )
}




export const SkeletonComponent = () => {
    return (
        <>
            <Card className="w-[200px] space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </Card>
            <Card className="w-[200px] space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </Card>
        </>
    )
}

export const Loading = () => {
    return (
        <div className={"loaderContainer"}>
            <div className={"loader"}></div>
        </div>
    );
};

export const ProfileDrop = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const loginData = useSelector(state => state.loginData)
    return (
        <Dropdown style={{ padding: '0px', width: '100px' }}>
            <DropdownTrigger>
                <Button
                    variant="normal"
                    onClick={() => {
                        document.getElementsByClassName("w-full flex flex-col gap-0.5 outline-none")[0].style.padding = "0px"
                    }}
                >
                    <div style={{ cursor: 'pointer', display: 'flex', padding: '3px 0px 4px 16px', marginTop: "8px" }}>
                        <UserIcon />
                        <span style={{ marginLeft: "8px", color: "white", fontWeight: "bold", marginTop: "6px" }}>Hi, {loginData?.firstName}</span>
                    </div>
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" disabledKeys={["name"]}>
                <DropdownItem key="name"><span style={{ fontWeight: "bold" }}>{loginData?.firstName + " " + loginData?.lastName}</span></DropdownItem>
                <DropdownItem onClick={() => {
                    router.push('/profile')
                }} startContent={<ProfileBlackIcon />} key="copy">Profile</DropdownItem>
                <DropdownItem onClick={() => {
                    localStorage.removeItem('loginData')
                    dispatch({ type: "USERDETAILS", payload: "" })
                    dispatch({ type: "ISLOGGEDIN", payload: false })
                    dispatch({ type: "LOGINDATA", payload: "" })
                    dispatch({ type: "TRIGGERAPI", payload: false })
                    router.push('/')
                }} startContent={<LogOut />} key="copy">Logout</DropdownItem>

            </DropdownMenu>
        </Dropdown>
    )
}

export const BookingDurationComp = (props) => {
    const { label, onChecked } = props
    const { filterString } = useSelector((state) => state)
    return (
        <div style={{ display: "flex" }}>
            <input onChange={onChecked} checked={filterString.bookingDuration == label ? true : false} className='checkboxSpace' type="checkbox" />
            <span>{label}</span>
        </div>
    )
}

const DropDown = () => {
    const [selectedKeys, setSelectedKeys] = useState("")
    const [defaultVal, setDefaultVal] = useState("saab")
    const subLocations = useSelector((state) => state.selectedCity.subLocation);
    const filterString = useSelector((state) => state.filterString);
    const defaultPickupLocation = useSelector((state) => state.defaultPickupLocation);

    const dispatch = useDispatch();

    useEffect(() => {
        apiCall()
    }, [filterString])

    useEffect(() => {
        if (subLocations) {
            setDefaultVal(subLocations[0].value)
        }
    }, [subLocations])

    return (
        <>
            <select style={{ height: "57px" }} className="form-select mobile-bot-space" onChange={async (e) => {
                const o = e.target.value
                setSelectedKeys(o)
                const filter = { ...filterString, pickupLocation: o }
                dispatch({ type: "FILTERSTRING", payload: filter })
                dispatch({ type: "DEFAULTPICKUPLOCATION", payload: o })
                dispatch({ type: "SELECTEDLOCALITY", payload: o })
            }} name="cars" id="cars">
                {
                    subLocations && subLocations.length ? subLocations.map((o) => (
                        <option selected={o.label == filterString.pickupLocation ? true : false} key={o.value} value={o.value}>{o.label}</option>
                    )) : ""
                }
            </select>
        </>
    );
}



export const SubHeader = () => {
    const dispatch = useDispatch();
    const startDate = useSelector((state) => state.startDate);
    const endDate = useSelector((state) => state.endDate);
    const startTime = useSelector((state) => state.startTime);
    const endTime = useSelector((state) => state.endTime);
    return (
        <div>
            {
                startTime ?
                    <div style={{ justifyContent: 'center', border: '1px solid #d3d3da', borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderTop: 'none', borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
                        <div style={{ padding: '24px' }} className="bot-space">
                            <div className="row">
                                <div className="col-md-2">
                                    <DropDown />
                                </div>
                                <div className="col-md-3">
                                    <DateSelection isBold={true} type={'STARTDATE'} />
                                </div>
                                <div className="col-md-2 mobile-bot-space">
                                    <TimerSelection type={'STARTTIME'} errType={'startTime'} label={'Start Time'} />
                                </div>
                                <div className="col-md-3">
                                    <DateSelection isBold={true} type={'ENDDATE'} />
                                </div>
                                <div className="col-md-2 mobile-bot-space">
                                    <TimerSelection type={'ENDTIME'} errType={'endTime'} label={'End Time'} />
                                </div>
                            </div>
                        </div>
                    </div> : null
            }

        </div>
    )
}

export const TimerSelection = (props) => {
    const { type, label, errType, triggerApi } = props
    const error = useSelector(state => state.error)
    const startTime = useSelector(state => state.startTime)
    const disabledKeys = useSelector(state => state.disabledKeys)
    const endTime = useSelector(state => state.endTime)
    const filterString = useSelector(state => state.filterString)
    const [defaultKeys, setdefaultKeys] = useState([])
    const dispatch = useDispatch();
    useEffect(() => {
        if (type == "STARTTIME") {
            setdefaultKeys([filterString.startTime])
        }
        if (type == "ENDTIME") {
            setdefaultKeys([filterString.endTime])
        }
    }, [filterString])
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            {defaultKeys.length ?
                <Select
                    isInvalid={error && error.type == errType}
                    errorMessage={error && error.msg}
                    label={label}
                    onChange={async (e) => {
                        const res = await getDateTimeInput(type, e.target.value)
                        isValid()
                        dispatch({ type: "FILTERSTRING", payload: { ...filterString, [type == "STARTTIME" ? "startTime" : "endTime"]: res } })
                    }}
                    disabledKeys={type == "STARTTIME" ? disabledKeys : []}
                    variant={'bordered'}
                    className="max-w-xs"
                    selectedKeys={defaultKeys}
                    defaultSelectedKeys={defaultKeys}
                >
                    {TimeRangeArr.map((ele, i) => {
                        return <SelectItem selected={i == 0} key={ele}>
                            {ele}
                        </SelectItem>
                    })}
                </Select> : ""
            }

        </div>
    );
}

export const DateSelection = (props) => {
    const { type, isBold } = props
    const [value, setValue] = React.useState();
    const { startDate, endDate, filterString, error } = useSelector(state => state)
    const dispatch = useDispatch()
    const handleChange = (date) => {
        dispatch({ type: type, payload: date })
    }
    return (
        <>
            <DatePicker
                isInvalid={type == "ENDDATE" && error.type == "endDate"} errorMessage={type == "ENDDATE" && error.msg}
                variant="bordered"
                minValue={today(getLocalTimeZone())}
                format="yyyy-MM-dd"
                className="max-w-[284px]"
                label={type == "STARTDATE" ? 'Pickup Date' : 'Return Date'}
                value={type == "STARTDATE" ? parseDate(moment(filterString.startDate).format('YYYY-MM-DD')) : parseDate(moment(filterString.endDate).format('YYYY-MM-DD'))}
                onChange={async (e) => {
                    const valueStr = moment(await getDateTimeInput(type, e)).format('YYYY-MM-DD')
                    isValid()
                    dispatch({ type: "FILTERSTRING", payload: { ...filterString, [type == "STARTDATE" ? "startDate" : "endDate"]: valueStr } })
                }}
            />
        </>
    )
}

const CustomInput = ({ value, onClick, label, isBold }) => {
    const styleObj = {
        display: 'block', fontSize: '13px', fontWeight: '400', marginLeft: '12px', fontWeight: "bold", color: "#47475e"
    }
    if (isBold) {
        styleObj.fontWeight = "normal";
    }
    return (
        <div className="mobile-bot-space" style={{ cursor: 'pointer', padding: "5px 0px", border: "2px solid rgb(225 225 245)", borderRadius: "10px", boxShadow: "var(--bs-box-shadow-sm) !important" }}>
            <span style={styleObj}>{label}</span>
            <div role="button" tabIndex="0" onClick={onClick} className="custom-input d-flex align-items-center container" >
                <button className="custom-input" style={{ fontWeight: '400', fontSize: '15px', color: "#797982" }}>
                    {value}
                </button>
                <div style={{ marginLeft: 'auto' }}>
                    <DateIcon />
                </div>
            </div>
        </div>
    )
};

export const DatePickerComponent = (props) => {
    const { type, label, errType, defaultVal } = props
    const error = useSelector(state => state.error)
    const filterString = useSelector(state => state.filterString)
    const dispatch = useDispatch()
    useEffect(() => {
        if (window.location.pathname !== '/') {
            apiCall()
        }
    }, [filterString])
    return (
        <DatePicker
            isInvalid={error && error.type == errType}
            errorMessage={error && error.msg}
            minValue={today(getLocalTimeZone())}
            //minValue={today(getLocalTimeZone())} 
            defaultValue={defaultVal ? defaultVal : ""}
            label={label}
            onChange={async (e) => {
                const res = await getDateTimeInput(type, e)
                isValid()
                dispatch({ type: "FILTERSTRING", payload: { ...filterString, [type == "STARTDATE" ? "startDate" : "endDate"]: res } })
            }}
            variant={'bordered'} className="max-w-[284px]"
        />
    )
}

export const TimePickerComponent = (props) => {
    const { type, label, errType, defaultVal } = props
    const error = useSelector(state => state.error)
    return (
        <TimeInput isInvalid={error && error.type == errType}
            errorMessage={error.msg} minValue={new Time(new Date().getMinutes() / 60 + new Date().getHours())}
            radius="none" variant={'bordered'} label={label}
            defaultValue={defaultVal ? defaultVal : ""}
            onChange={(e) => {
                getDateTimeInput(type, e)
                isValid()
            }}
        />
    )
}