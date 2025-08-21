import React, { useMemo, useState, useRef } from "react";
import { getPricePrediction } from "../../lib/api";

const FEATURE_CONFIG = {
    pg: [
        "location_city",
        "location_state",
        "room_type",
        "occupancy_limit",
        "gender_preference",
        "food_included",
        "is_furnished",
        "rating",
        "wifi",
        "ac",
        "laundry",
        "attached_bathroom",
        "meals",
        "housekeeping",
        "parking",
        "cctv",
        "study_table",
        "wardrobe",
        "water",
        "security",
        "power_backup",
        "fridge",
        "tv",
        "geyser",
    ],
    hostel: [
        "location_city",
        "location_state",
        "room_type",
        "occupancy_limit",
        "gender_preference",
        "food_included",
        "is_furnished",
        "rating",
        "wifi",
        "ac",
        "laundry",
        "attached_bathroom",
        "meals",
        "housekeeping",
        "parking",
        "cctv",
        "study_table",
        "wardrobe",
        "water",
        "security",
        "power_backup",
        "fridge",
        "tv",
        "geyser",
    ],
    mess: ["location_city", "location_state", "food_included", "rating"],
    tiffin: ["location_city", "location_state", "food_included", "rating"],
    tutor: ["location_city", "location_state", "rating"],
};

const AMENITY_KEYS = [
    "wifi",
    "ac",
    "laundry",
    "attached_bathroom",
    "meals",
    "housekeeping",
    "parking",
    "cctv",
    "study_table",
    "wardrobe",
    "water",
    "security",
    "power_backup",
    "fridge",
    "tv",
    "geyser",
];

const ROOM_TYPES = ["single", "double", "triple", "quad", "dorm"];
const GENDER_CHOICES = ["male", "female", "any"];

export default function PricePredictionForm() {
    const [category, setCategory] = useState("pg");
    const [formData, setFormData] = useState({});
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resultRef = useRef(null);
    const fields = useMemo(() => FEATURE_CONFIG[category], [category]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field) => {
        setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setPredictedPrice(null);

        try {
            const amenitiesList = AMENITY_KEYS.filter((k) => !!formData[k]);

            const payload = {
                category,
                choices: {
                    ...formData,
                    amenities: amenitiesList,
                },
            };

            const res = await getPricePrediction(payload);
            if (typeof res?.predicted_price === "number") {
                setPredictedPrice(res.predicted_price);
                if (resultRef.current) {
                    resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                throw new Error("Invalid response shape from server.");
            }
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.error || err?.message || "Failed to get prediction."
            );
        } finally {
            setLoading(false);
        }
    };

    const onCategoryChange = (e) => {
        setCategory(e.target.value);
        setFormData({});
        setPredictedPrice(null);
        setError("");
    };

    const labelOf = (f) =>
        f.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());

    return (
        <div className="container mx-auto px-4 md:px-6 py-10">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition p-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-primary">
                        Price Prediction
                    </h2>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Category</span>
                        </label>
                        <select
                            value={category}
                            onChange={onCategoryChange}
                            className="select select-bordered w-full"
                        >
                            <option value="pg">PG</option>
                            <option value="hostel">Hostel</option>
                            <option value="mess">Mess</option>
                            <option value="tiffin">Tiffin</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {fields.map((field) => {
                            if (field === "room_type") {
                                return (
                                    <div key={field} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Room Type</span>
                                        </label>
                                        <select
                                            value={formData[field] ?? ""}
                                            onChange={(e) => handleChange(field, e.target.value)}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select</option>
                                            {ROOM_TYPES.map((rt) => (
                                                <option key={rt} value={rt}>
                                                    {rt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }

                            if (field === "gender_preference") {
                                return (
                                    <div key={field} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Gender Preference
                                            </span>
                                        </label>
                                        <select
                                            value={formData[field] ?? ""}
                                            onChange={(e) => handleChange(field, e.target.value)}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select</option>
                                            {GENDER_CHOICES.map((g) => (
                                                <option key={g} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }

                            if (["food_included", "is_furnished", ...AMENITY_KEYS].includes(field)) {
                                return (
                                    <label
                                        key={field}
                                        className="cursor-pointer label flex justify-start gap-3"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!formData[field]}
                                            onChange={() => handleCheckboxChange(field)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">{labelOf(field)}</span>
                                    </label>
                                );
                            }

                            if (field === "occupancy_limit") {
                                return (
                                    <div key={field} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Occupancy Limit
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1}
                                            value={formData[field] ?? ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    field,
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                );
                            }

                            if (field === "rating") {
                                return (
                                    <div key={field} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Rating</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            value={formData[field] ?? ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    field,
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={field} className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            {labelOf(field)}
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field] ?? ""}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                        className="input input-bordered w-full"
                                        placeholder={labelOf(field)}
                                    />
                                </div>
                            );
                        })}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2"
                        >
                            {loading ? "Predicting…" : "Get Price"}
                        </button>
                    </form>

                    {error && <div className="alert alert-error mt-4">{error}</div>}

                    {predictedPrice !== null && (
                        <div className="alert alert-success mt-4 lg:hidden">
                            <span>
                                <strong>Predicted Price:</strong> ₹{predictedPrice}
                            </span>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-8 self-start" ref={resultRef}>
                    <div className="card shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 p-8 min-h-[300px] flex items-center justify-center">
                            <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center text-white">
                                {predictedPrice === null ? (
                                    <>
                                        <h3 className="text-2xl font-bold">Ready for your prediction?</h3>
                                        <p className="mt-2 opacity-90">
                                            Enter the details on the left and get an instant estimate.
                                        </p>
                                        <div className="mt-6">
                                            <span className="badge badge-outline badge-lg border-white/60 text-white/90">
                                                {loading ? "Calculating…" : "Awaiting inputs"}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold">Predicted Price</h3>
                                        <p className="mt-4 text-4xl font-extrabold">
                                            ₹{predictedPrice}
                                        </p>
                                        <p className="mt-2 text-sm opacity-90">
                                            Based on your selected category & choices.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}