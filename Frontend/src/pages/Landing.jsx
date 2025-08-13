import React from "react";
import { Link } from "react-router";
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import { FaMapMarkerAlt, FaUsers, FaStar, FaQuoteLeft } from "react-icons/fa";

function Landing() {
    return (
        <>
            <div className="w-full overflow-x-hidden">
                <section
                    className={`relative min-h-screen bg-gradient-to-br from-indigo-500/90 via-purple-600/90 to-pink-600/90 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-pink-900/90 text-gray-900 dark:text-gray-100`}
                >
                    <div className="container mx-auto px-6 lg:px-20 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                                CampusConnect — find the right place, and the right people.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg opacity-90 dark:opacity-80">
                                CampusConnect brings verified student listings, roommate matching, and honest reviews together — so moving campuses feels less like a leap and more like a step.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                                <Link
                                    to="/signup"
                                    className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition border border-black"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/about"
                                    className="btn btn-lg btn-ghost border border-current text-current hover:bg-pink-500 hover:text-white transition"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <div
                                className="w-full max-w-md rounded-2xl p-6 shadow-2xl bg-base-100 dark:bg-base-900"
                            >
                                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-base-200 to-base-300 dark:from-base-700 dark:to-base-800 p-6">
                                    <img src={img1} alt="CampusConnect showcase" className="w-full rounded-lg shadow"/>
                                </div>

                                <div className="mt-4 text-base-content dark:text-base-content">
                                    <h3 className="text-lg font-semibold">
                                        Find PGs · Compare prices · Read reviews
                                    </h3>
                                    <p className="mt-2 text-sm">
                                        Browse by city, amenities, price range — everything students care about.
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <a href="/browse">
                                            <button className="btn btn-sm btn-outline dark:btn-primary">
                                                Browse Listings
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-20 bg-base-200 dark:bg-base-800 text-base-content dark:text-base-content">
                    <div className="container mx-auto px-6 lg:px-20">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
                            Why Choose CampusConnect?
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="flex flex-col items-center text-center p-6 bg-base-100 dark:bg-base-900 rounded-xl shadow-lg transition hover:shadow-2xl">
                                <FaMapMarkerAlt className="text-pink-500 dark:text-pink-400 mb-4 text-5xl" />
                                <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                                <p className="text-sm opacity-90">
                                    Only authentic, verified listings from trusted hosts to make your search safe and reliable.
                                </p>
                            </div>

                            <div className="flex flex-col items-center text-center p-6 bg-base-100 dark:bg-base-900 rounded-xl shadow-lg transition hover:shadow-2xl">
                                <FaUsers className="text-purple-500 dark:text-purple-400 mb-4 text-5xl" />
                                <h3 className="text-xl font-semibold mb-2">Roommate Matching</h3>
                                <p className="text-sm opacity-90">
                                    Find compatible roommates through our smart matching system based on your preferences.
                                </p>
                            </div>

                            <div className="flex flex-col items-center text-center p-6 bg-base-100 dark:bg-base-900 rounded-xl shadow-lg transition hover:shadow-2xl">
                                <FaStar className="text-indigo-500 dark:text-indigo-400 mb-4 text-5xl" />
                                <h3 className="text-xl font-semibold mb-2">Honest Reviews</h3>
                                <p className="text-sm opacity-90">
                                    Read real student reviews and ratings to choose the best place with confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-20 bg-base-200 dark:bg-base-800 text-base-content dark:text-base-content">
                    <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
                                About CampusConnect
                            </h2>
                            <p className="text-lg opacity-90 dark:opacity-80 max-w-xl mx-auto lg:mx-0">
                                CampusConnect is dedicated to simplifying campus life for students by providing a platform with verified listings, AI based price prediction, and authentic reviews — all designed to help you make the right choices quickly and confidently.
                            </p>
                            <Link
                                to="/about"
                                className="inline-block mt-6 text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                            >
                                Read More &rarr;
                            </Link>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <div className="max-w-md rounded-2xl overflow-hidden shadow-lg bg-base-100 dark:bg-base-900 p-4">
                                <img src={img2} alt="About CampusConnect" className="w-full rounded-lg"/>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-20 bg-base-200 dark:bg-base-800 text-base-content dark:text-base-content">
                    <div className="container mx-auto px-6 lg:px-20">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
                            What Students Say
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {[
                                {
                                    name: "Ankit Sharma",
                                    role: "Computer Science Student",
                                    feedback: "CampusConnect helped me find the perfect PG with trustworthy reviews. Saved me a lot of hassle!",
                                    rating: 5,
                                },
                                {
                                    name: "Sneha Patel",
                                    role: "MBA Student",
                                    feedback: "The price prediction feature made my campus life much easier. Found great place under budget!",
                                    rating: 4,
                                },
                                {
                                    name: "Rahul Mehta",
                                    role: "Engineering Student",
                                    feedback: "Verified listings gave me peace of mind. I highly recommend CampusConnect to all new students.",
                                    rating: 5,
                                }
                            ].map(({ name, role, feedback, rating }, i) => (
                                <div key={i} className="bg-base-100 dark:bg-base-900 rounded-xl p-6 shadow-lg flex flex-col">
                                    <FaQuoteLeft className="text-pink-500 dark:text-pink-400 text-4xl mb-4" />
                                    <p className="text-sm flex-grow opacity-90 mb-6">"{feedback}"</p>

                                    <div className="flex items-center mb-2 space-x-2">
                                        {Array(5).fill(0).map((_, idx) => (
                                            <FaStar
                                                key={idx}
                                                className={`text-yellow-400 ${idx < rating ? "opacity-100" : "opacity-30"}`}
                                            />
                                        ))}
                                    </div>

                                    <div>
                                        <p className="font-semibold">{name}</p>
                                        <p className="text-xs opacity-70">{role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}

export default Landing;