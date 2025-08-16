import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const Chart_Colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE"];

export default function BarChartStateWise({ listingsGrowthStats: stats }) {
    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">Listings by State</h2>

                {!stats?.stateWise ? (
                    <p className="text-center text-gray-500 py-10">
                        No data available
                    </p>
                ) : (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.stateWise}
                                margin={{ top: 20, right: 30, left: 20, bottom: 55 }}
                                barSize={60}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="state" angle={-30} textAnchor="end" interval={0} label={{
                                        value: "States",
                                        position: "insideBottom",
                                        offset: -53,
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: 16,
                                            fill: "#DDD"
                                        }
                                    }}
                                />
                                <YAxis allowDecimals={false} label={{
                                    value: "No. of Listings",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        textAnchor: "middle",
                                        fontSize: 16,
                                        fill: "#DDD"
                                    }
                                }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Listings">
                                    {stats.stateWise.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={Chart_Colors[index % Chart_Colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
