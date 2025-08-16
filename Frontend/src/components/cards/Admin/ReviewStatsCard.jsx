import { ClipboardCheck, Clock, Star } from "lucide-react";

const ReviewStatsCard = ({ reviewsGrowthStats:stats }) => {
    return (
        <div className="card bg-red-500/90 text-white shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="card-body p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="card-title text-lg font-semibold opacity-90">Review Status</h2>
                        <p className="text-4xl font-bold mt-2 mb-1">
                            {stats.total}
                            <span className="text-lg ml-2 opacity-80">Total Reviews</span>
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                {/* <ClipboardCheck className="size-6 text-green-600/80" strokeWidth="2.5px"/> */}
                                <div>
                                    <p className="text-sm opacity-80">Approved</p>
                                    <p className="text-xl font-semibold">{stats.approved}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <Clock className="size-6 text-yellow-500/90" strokeWidth="2.5px" /> */}
                                <div>
                                    <p className="text-sm opacity-80">Pending</p>
                                    <p className="text-xl font-semibold">{stats.pending}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="avatar placeholder">
                        <div className="bg-secondary-content bg-opacity-20 text-secondary-content rounded-full w-12 h-12 flex items-center justify-center">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewStatsCard;