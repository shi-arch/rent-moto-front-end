
'use client'
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { BikeCard, Loading, SubHeader } from '../../components/commonComponents';
import { Select, SelectItem, useSelect } from "@nextui-org/select";
import { postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, brands, categories, defaultVal, dispatchFunction } from '../../utils/constants';
import { CitiesModal } from '../../utils/modal';
import moment from 'moment';

export default function Page() {
    const dispatch = useDispatch()
    const { bookings } = useSelector((state) => state.loginData);
    return (
        <div className='container'>
            <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#e03546', margin: "30px 0px" }}>My Bookings</h4>
            </div>
            <div className='row' style={{ textAlign: 'center', display: "flex" }}>
                {
                    bookings && bookings.length ? bookings.map((obj) => {
                        const { bookingData, vehicleData } = obj
                        const { brand, distanceLimit, name, pricePerday, transmissionType, url } = vehicleData
                        const { location, vehicleNumber, BookingEndDateAndTime, BookingStartDateAndTime, bookingAmount, _id, pickupLocation } = bookingData
                        return (
                            <div className='col-md-3' style={{ marginBottom: '25px' }}>
                                <Card style={{ marginLeft: 'auto' }}>
                                    <CardHeader style={{ display: "flex" }}>
                                        <img alt="Svg icon" src={url} style={{ width: '90px', height: '60px' }} />
                                        <h6 style={{ color: '#e03546', marginLeft: 'auto' }}>{name}</h6>
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Order Id</span>
                                            <span style={{ marginLeft: 'auto' }}>{_id.substr(0, 8)}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Vehicle Number</span>
                                            <span style={{ marginLeft: 'auto' }}>{vehicleNumber}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span >City Location</span>
                                            <span style={{ marginLeft: 'auto' }}>{location}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span >Pickup Location</span>
                                            <span style={{ marginLeft: 'auto' }}>{pickupLocation}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Pickup Time</span>
                                            <span style={{ marginLeft: 'auto' }}>{BookingStartDateAndTime.startTime}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Pickup Date</span>
                                            <span style={{ marginLeft: 'auto' }}>{moment(BookingStartDateAndTime.startDate).format('D MMM, YYYY')}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Drop Time</span>
                                            <span style={{ marginLeft: 'auto' }}>{BookingEndDateAndTime.endTime}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Drop Date</span>
                                            <span style={{ marginLeft: 'auto' }}>{moment(BookingEndDateAndTime.endDate).format('D MMM, YYYY')}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Booking Amount</span>
                                            <span style={{ marginLeft: 'auto' }}>{bookingAmount}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Disptance Limit</span>
                                            <span style={{ marginLeft: 'auto' }}>{distanceLimit}</span>
                                        </div>
                                        <div style={{ display: "flex", fontWeight: '500', fontSize: '14px' }}>
                                            <span>Transmission Type</span>
                                            <span style={{ marginLeft: 'auto' }}>{transmissionType}</span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    }) : <div style={{ border: '2px dashed #00a32a', padding: '10px', marginBottom: '10px' }}><h1>No Bookings</h1></div>
                }

            </div>
        </div>
    );
}
