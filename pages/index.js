import React from 'react'
import Headers from './header'
import Footer from './footer'

export default function LandingPage() {

        return (
                <>
                        <Headers />
                        <main class="d-flex align-items-center vh-100">
                                <div class="container">
                                        <div class="row no-gutters">
                                                <div class="col-md-6 p-5 bg-white">
                                                        <h1>Commuting Made <span class="highlight">Easy</span>, <span class="highlight">Affordable</span> and <span class="highlight">Quick</span></h1>
                                                        <p>Scooter/Scooty/Bike on Rent in Bangalore</p>
                                                        <form>
                                                                <div class="form-group">
                                                                        <input type="text" value="Bangalore" readonly class="form-control" />
                                                                </div>
                                                                <div class="form-group">
                                                                        <input type="datetime-local" value="2024-07-09T12:00" class="form-control" />
                                                                </div>
                                                                <div class="form-group">
                                                                        <input type="datetime-local" value="2024-07-10T12:00" class="form-control" />
                                                                </div>
                                                                <div class="form-group">
                                                                        <p>Duration: 1 Day</p>
                                                                </div>
                                                                <button type="submit" class="btn btn-success btn-block">Search</button>
                                                        </form>
                                                </div>
                                                <div class="col-md-6">
                                                        <div class="image-section" style={{ backgroundImage: "url('https://gobikes-stage-public.s3.ap-south-1.amazonaws.com/uploads/admin/site/732e4cae-2e8e-469e-8b01-217fc7095422.webp')" }}></div>
                                                </div>
                                        </div>
                                </div>
                        </main>
                        <Footer />                        
                </>
        )
}
