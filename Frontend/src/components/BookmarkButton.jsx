import { Bookmark } from "lucide-react";
import useToggleBookmark from "../hooks/useToggleBookmarks";

const BookmarkButton = ({ listingId, isBookmarked, view = "listing" }) => {
    const { toggleBookmarkMutation, isPending } = useToggleBookmark();

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleBookmarkMutation({ listingId });
    };

    return (
        <button onClick={handleClick} disabled={isPending} className={`btn ${isBookmarked ? "btn-primary" : "btn-outline"} w-full mb-4 ${isPending ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
            <Bookmark size={16} className={`${isBookmarked ? "fill-current" : ""}`} />
            {
                view==="listing" && <span className="hidden sm:inline ml-2">
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </span>
            }
        </button>
    );
};

export default BookmarkButton;
