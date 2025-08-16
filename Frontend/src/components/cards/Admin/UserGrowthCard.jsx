import { TrendingUp } from "lucide-react";

const UserGrowthCard = ({ userGrowthStats: stats }) => {
    return (
        <div className="card bg-success text-white shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="card-body p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <h2 className="card-title text-lg font-semibold opacity-90">Users Growth</h2>
                        <p className="text-4xl font-bold mt-2 mb-1">
                            {stats.total}
                            <span className="text-lg ml-2 opacity-80">Total Users</span>
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <div>
                                <p className="text-sm opacity-80">This month</p>
                                <p className="text-xl font-semibold">{stats.thisMonth}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Last month</p>
                                <p className="text-xl font-semibold">{stats.lastMonth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="avatar placeholder">
                        <div className="bg-primary-content bg-opacity-20 text-primary-content rounded-full w-12">
                            <TrendingUp className="w-6 h-6"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGrowthCard;