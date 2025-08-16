import { BarChart, PieChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CATEGORY_CHOICES } from '../../../constants/constants';

const Chart_Colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];
const PieChartCategoryWise = ({ listingsGrowthStats: stats }) => {

    const getCategoryLabel = (category) => {
        return CATEGORY_CHOICES.find(([value]) => value === category)?.[1] || category;
    };

    return (
        <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold mb-4">
                    Listing Category Distribution
                </h2>
                <div className="flex justify-center">
                    {!stats?.categoryWise ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryWise}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="count"
                                        nameKey="category"
                                        label={({ category, percent }) =>
                                            `${getCategoryLabel(category)} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {stats.categoryWise.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={Chart_Colors[index % Chart_Colors.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}`, "Listings"]} />
                                    <Legend verticalAlign="bottom" layout="horizontal" align="center"
                                        wrapperStyle={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "center",
                                            maxWidth: "100%",
                                            // top: "88%"
                                        }}
                                        formatter={(value) => getCategoryLabel(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PieChartCategoryWise
