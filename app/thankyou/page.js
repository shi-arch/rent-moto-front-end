
'use client'
import { useEffect, useState } from 'react';
import './dashboard.css'
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { BikeCard, Loading, SubHeader } from '../../components/commonComponents';
import { Select, SelectItem, useSelect } from "@nextui-org/select";
import { postApi } from '../response/api';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, brands, categories, defaultVal, dispatchFunction } from '../../utils/constants';
import { CitiesModal } from '../../utils/modal';

export default function Page() {
  const dispatch = useDispatch()
  const {paymentMethod} = useSelector((state) => state);
  const [amount, setTotalAmount] = useState(0)
  const { name, vehicleNumber, _id, vehicleCount, pricePerday } = useSelector(state => state.selectedVehicle)
  const { myLocation } = useSelector(state => state.selectedCity)
  const { startDate, endDate, startTime, endTime, selectedLocality } = useSelector(state => state)
  useEffect(() => {
    let price = pricePerday * 0.14
    let total = parseInt(pricePerday) + price * 2
    setTotalAmount(total.toFixed())
  }, [])
  return (
    <div className='container'>
      <div className='mobile-view' style={{ textAlign: 'center', margin: '29px 165px' }}>
        <Card>
          <CardHeader style={{ display: "block" }}>
            <h3 style={{ color: 'green' }}>Thank you. Your booking has been confirmed.</h3>
          </CardHeader>
          <CardBody>
            <div style={{ border: '2px dashed #00a32a', padding: '10px', marginBottom: '10px' }}>
              <div className='row'>
                <div className='col-md-3'>
                  <span style={{ fontWeight: '700' }}>Vehicle Name</span><br /><span>{name}</span>
                </div>
                <div className='col-md-3'>
                  <span style={{ fontWeight: '700' }}>Vehicle Number</span><br /><span>{vehicleNumber}</span>
                </div>
                <div className='col-md-3'>
                  <span style={{ fontWeight: '700' }}>Pickup Time</span><br /><span>{startDate + ", " + startTime}</span>
                </div>
                <div className='col-md-3'>
                  <span style={{ fontWeight: '700' }}>Drop Time</span><br /><span>{endDate + ", " + endTime}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', margin: '20px 0px' }}><h5>Order Details</h5></div>
            <p><span style={{ fontWeight: '700' }}> Order Number</span> <label htmlFor="name" style={{ float: "right" }}>{_id}</label></p>
            <p><span style={{ fontWeight: '700' }}> Total Booking Amount</span> <label htmlFor="name" style={{ float: "right" }}>{amount}</label></p>
            <p><span style={{ fontWeight: '700' }}> Payment Method</span> <label htmlFor="name" style={{ float: "right" }}>{paymentMethod}</label></p>
            <p><span style={{ fontWeight: '700' }}> Payment Status</span> <label htmlFor="name" style={{ float: "right" }}>{paymentMethod == "Online" ? "Completed" : "Pending"}</label></p>
            <p><span style={{ fontWeight: '700' }}> Location</span> <label htmlFor="name" style={{ float: "right" }}>{myLocation + ", " + selectedLocality}</label></p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
