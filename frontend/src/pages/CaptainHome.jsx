import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect } from 'react'
import { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/socketContext'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const { captain } = useContext(CaptainDataContext)
    const { socket } = useContext(SocketContext)
    const [ride, setRide] = useState(null);

    useEffect(() => {
        socket.emit('join', { userType: 'captain', userId: captain._id });
        // console.log("HE")
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    // console.log("Captain : ", {
                    //   userId: captain._id,
                    //   location: {
                    //     lat: position.coords.latitude,
                    //     lng: position.coords.longitude,
                    //   },
                    // });
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location :{
                        lat: position.coords.latitude,
                        lng : position.coords.longitude}
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // return () => clearInterval(locationInterval)
    }, [])
    
    socket.on('new-ride', (data) => {
        // console.log(data);
        setRide(data);
        // console.log("Ride Created 100")
        console.log(data);
        // setConfirmRidePopupPanel(true);
        setRidePopupPanel(true);
        console.log("Ride Created 200")
    })

    async function confirmRide() {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
          {
            rideId: ride._id,
              captainId: captain._id,
              headers: {
                Authorization : "Bearer ${localStorage.getItem{'token'}}"
            }
          }
        );
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])
    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])
    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-40' src="/logolucid.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="/map.jpeg" alt="" />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride = {ride}
                    setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}    
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} ride={ride} />
            </div>
        </div>
    )
}

export default CaptainHome;