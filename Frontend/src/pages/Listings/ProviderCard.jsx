import { Calendar, Mail, Phone, X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../lib/axios"; // your axios wrapper with auth headers
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";

const ProviderCard = ({ listing, isFoodService }) => {
    const [showModal, setShowModal] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const {user}=useUser();

    const handleSend = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            setMessage((prev)=>prev+" for "+listing?.provider_email)
            await axiosInstance.post("auth/send-email/", {
                to: "yashparekh914@gmail.com",
                subject,
                message,
            })

            // Show success toast
            toast.success('Email sent successfully! 🎉', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            // Close modal and reset form
            setShowModal(false)
            setSubject("")
            setMessage("")
        } catch (err) {
            console.error(err)

            // Show error toast
            toast.error('Failed to send email. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">About the Provider</h3>
            <div className="flex items-center gap-4 mb-6">
                <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-16">
                        <span className="text-xl">{listing.provider_name.charAt(0)}</span>
                    </div>
                </div>
                <div>
                    <p className="font-bold">{listing.provider_name}</p>
                    <p className="text-sm text-gray-500">
                        {isFoodService ? 'Food provider' : 'Host'} since {new Date(listing.created_at).getFullYear()}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <a href={`tel:${listing.provider_phone}`} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer">
                    <Phone size={18} className="text-gray-500" />
                    <span className="hover:text-primary">{listing.provider_phone}</span>
                </a>
                {/* Open modal instead of mailto */}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex w-full items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer"
                    disabled={user.role === "admin"}
                >
                    <Mail size={18} className="text-gray-500" />
                    <span className="hover:text-primary">{listing.provider_email}</span>
                </button>
                <div className="flex items-center gap-3 p-3">
                    <Calendar size={18} className="text-gray-500" />
                    <span>Posted: {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-base-100 text-base-content rounded-xl p-6 w-full max-w-md shadow-lg border border-base-300 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-base-200 transition-colors"
                        >
                            <X size={20} className="text-base-content/70" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold">Send Email</h2>
                            <p className="text-sm text-base-content/70 mt-1">to {listing.provider_name}</p>
                        </div>

                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text font-medium">Subject</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter subject line"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium">Message</span>
                                </label>
                                <textarea
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="textarea textarea-bordered w-full h-32 bg-base-200 focus:bg-base-100 transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-ghost flex-1"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex-1 gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={16} />
                                            Send Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    )
}

export default ProviderCard