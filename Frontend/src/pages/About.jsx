import React from 'react';
import { Link } from "react-router";
import { FaUsers, FaHome, FaHandshake } from "react-icons/fa";

const About = () => {
    return (
        <>
            <div className="min-h-screen bg-base-100 text-base-content">
                <section className="py-16 px-6 text-center relative bg-gradient-to-br from-indigo-500/90 via-purple-600/90 to-pink-600/90 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-pink-900/90 text-gray-900 dark:text-gray-100 text-primary-content">
                    <h1 className="text-5xl font-bold mb-4">About CampusConnect</h1>
                    <p className="max-w-2xl mx-auto text-lg">
                        Connecting students with trusted housing and like-minded roommates.
                        Built for students, by students.
                    </p>
                </section>

                <section className="py-16 px-6 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Mission</h2>
                    <p className="text-lg text-center max-w-3xl mx-auto">
                        At CampusConnect, our goal is to make your college housing search easy,
                        safe, and reliable. We know how stressful it can be to find the right
                        place to live and the right people to live with — that’s why we’ve built
                        a platform to bring students together and make that process smooth.
                    </p>
                </section>

                <section className="py-16 px-6 bg-base-200">
                    <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
                        <div className="card bg-base-100 shadow-xl p-6 text-center">
                            <FaHome className="mx-auto text-5xl text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                            <p>Browse authentic, verified accommodations near your campus with all the details you need.</p>
                        </div>

                        <div className="card bg-base-100 shadow-xl p-6 text-center">
                            <FaUsers className="mx-auto text-5xl text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Find Roommates</h3>
                            <p>Match with students who share similar preferences, lifestyle, and values.</p>
                        </div>

                        <div className="card bg-base-100 shadow-xl p-6 text-center">
                            <FaHandshake className="mx-auto text-5xl text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Safe Connections</h3>
                            <p>We prioritize your safety with profile verification and secure communication tools.</p>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
                    <p className="max-w-2xl mx-auto mb-6">
                        Whether you’re moving into your first apartment or looking for your next roommate, CampusConnect is here to help you every step of the way.
                    </p>
                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                </section>
            </div>
        </>
    )
}

export default About;