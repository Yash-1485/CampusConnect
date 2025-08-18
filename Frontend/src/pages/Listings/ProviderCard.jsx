import { Calendar, Mail, Phone } from "lucide-react"

const ProviderCard = ({ listing, isFoodService }) => {

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
                <a href={`mailto:${listing.provider_email}`} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer">
                    <Mail size={18} className="text-gray-500" />
                    <span className="hover:text-primary">{listing.provider_email}</span>
                </a>
                <div className="flex items-center gap-3 p-3">
                    <Calendar size={18} className="text-gray-500" />
                    <span>Posted: {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    )
}

export default ProviderCard
