import { useState } from "react";
import { getReviewSentiment } from "../../lib/api";
import { Send, AlertCircle, Loader, Smile, Meh, Frown, Sparkles, Star, Clipboard } from "lucide-react";

export default function ReviewAnalysis() {
    const [comment, setComment] = useState("");
    const [sentimentData, setSentimentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        if (!comment.trim()) {
            setError("Please enter a review before checking");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getReviewSentiment(comment);
            if (result?.success && result?.data?.sentiment) {
                setSentimentData(result.data);
                console.log(sentimentData)
            } else {
                setError(result?.message || "Unable to analyze sentiment. Please try again.");
            }
        } catch (err) {
            setError("An error occurred while analyzing your review");
            console.error("Sentiment analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !loading) {
            handleCheck();
        }
    };

    const getSentimentIcon = () => {
        switch (sentimentData?.sentiment) {
            case "positive":
                return <Smile className="w-16 h-16 text-success" />;
            case "neutral":
                return <Meh className="w-16 h-16 text-warning" />;
            case "negative":
                return <Frown className="w-16 h-16 text-error" />;
            default:
                return null;
        }
    };

    const getSentimentColor = () => {
        switch (sentimentData?.sentiment) {
            case "positive":
                return "bg-success/20 text-success-content border-success/30";
            case "neutral":
                return "bg-warning/20 text-warning-content border-warning/30";
            case "negative":
                return "bg-error/20 text-error-content border-error/30";
            default:
                return "bg-base-200 text-base-content";
        }
    };

    const getSentimentTitle = () => {
        switch (sentimentData?.sentiment) {
            case "positive":
                return "Positive Review";
            case "neutral":
                return "Neutral Review";
            case "negative":
                return "Negative Review";
            default:
                return "Analysis Result";
        }
    };

    const getSentimentDescription = () => {
        switch (sentimentData?.sentiment) {
            case "positive":
                return "This review expresses satisfaction and positive experience";
            case "neutral":
                return "This review has a neutral or mixed tone";
            case "negative":
                return "This review indicates dissatisfaction or negative experience";
            default:
                return "";
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sentimentData.comment);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Panel - Input Form */}
                <div className="w-full md:w-1/2 bg-gradient-to-b from-primary/10 to-secondary/20 p-8 flex flex-col">
                    <div className="flex items-center mb-6">
                        <div className="bg-primary p-2 rounded-lg">
                            <Sparkles className="w-6 h-6 text-primary-content" />
                        </div>
                        <h2 className="text-2xl font-bold ml-3 text-base-content">Review Sentiment Analysis</h2>
                    </div>

                    <p className="text-base-content/70 mb-6">Discover the emotional tone of your reviews with AI-powered sentiment analysis</p>

                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text font-medium text-base-content">Enter your review</span>
                            <span className="label-text-alt text-base-content/60">{comment.length}/500</span>
                        </label>
                        <div className="relative">
                            <textarea
                                className="textarea textarea-bordered h-40 w-full resize-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary pr-10 rounded-xl"
                                value={comment}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) {
                                        setComment(e.target.value);
                                        setError(null);
                                    }
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="The food was delicious and the service was excellent..."
                                disabled={loading}
                            />
                            {comment.length > 0 && !loading && (
                                <button
                                    className="absolute right-3 top-3 text-base-content/40 hover:text-base-content/60 transition-colors bg-base-100 rounded-full p-1"
                                    onClick={() => setComment("")}
                                    title="Clear text"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error shadow-lg mb-6">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <button
                        className={`btn w-full transition-all duration-300 ${loading ? 'btn-disabled' : 'btn-primary shadow-md hover:shadow-lg rounded-xl'}`}
                        onClick={handleCheck}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Analyze Sentiment
                            </>
                        )}
                    </button>

                    <div className="mt-6">
                        <p className="text-base-content/60 text-sm font-medium mb-2">Try these examples:</p>
                        <div className="flex flex-col gap-2">
                            <button
                                className="text-left text-xs bg-primary/10 py-2 px-3 rounded-lg hover:bg-primary/20 transition-colors"
                                onClick={() => setComment("Absolutely loved the atmosphere and friendly staff! Will definitely come back again.")}
                            >
                                "Absolutely loved the atmosphere and friendly staff!"
                            </button>
                            <button
                                className="text-left text-xs bg-primary/10 py-2 px-3 rounded-lg hover:bg-primary/20 transition-colors"
                                onClick={() => setComment("The service was excellent but the food was mediocre")}
                            >
                                "The service was excellent but the food was mediocre"
                            </button>
                            <button
                                className="text-left text-xs bg-primary/10 py-2 px-3 rounded-lg hover:bg-primary/20 transition-colors"
                                onClick={() => setComment("Would not recommend, poor quality and overpriced")}
                            >
                                "Would not recommend, poor quality and overpriced"
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Results */}
                <div className="w-full md:w-1/2 bg-base-100 p-8 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-base-content mb-6 text-center">Analysis Results</h3>

                    {sentimentData ? (
                        <div className="flex flex-col items-center">
                            <div className={`p-6 rounded-2xl border-2 ${getSentimentColor()} w-full mb-6 transition-all duration-500`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-lg">{getSentimentTitle()}</h4>
                                    <div className="flex items-center">
                                        {getSentimentIcon()}
                                    </div>
                                </div>

                                <p className="text-sm mb-4">{getSentimentDescription()}</p>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${sentimentData.sentiment === "positive" ? "text-warning fill-warning" :
                                                sentimentData.sentiment === "neutral" ? "text-warning/70 fill-warning/70" :
                                                    "text-base-content/30"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="bg-base-100 p-4 rounded-xl border border-base-300 mt-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium text-base-content/60">Analyzed Text</span>
                                        <button
                                            className="text-base-content/40 hover:text-primary transition-colors"
                                            onClick={copyToClipboard}
                                            title="Copy to clipboard"
                                        >
                                            <Clipboard className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-base-content">"{sentimentData.comment}"</p>
                                </div>
                            </div>

                            <div className="text-center text-xs text-base-content/60">
                                <p>Sentiment analysis powered by AI</p>
                                <p>Results are based on language patterns and emotional cues</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-center p-6 rounded-2xl bg-base-200 border-2 border-dashed border-base-300 w-full">
                                <Sparkles className="w-12 h-12 text-base-content/40 mx-auto mb-4" />
                                <h4 className="font-medium text-base-content/60 mb-2">No analysis yet</h4>
                                <p className="text-xs text-base-content/40">Enter a review and click "Analyze Sentiment" to see results here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}