import axiosInstance from './axios';

// User
export const signup = async (signupData) => {
    const response = await axiosInstance.post('/auth/signup/', signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post('/auth/login/', loginData);
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout/');
    return response.data;
}

// For only One User
export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/user/');
        return response.data;
    }
    catch (error) {
        console.log("Error in getUser:", error);
        return null;
    }
}

// Listings
export const getListing = async (id) => {
    try {
        const response = await axiosInstance.get(`/listings/${id}/`);
        return response.data;
    }
    catch (error) {
        console.log("Error in getListing:", error);
        return null;
    }
}

export const fetchAllListings = async () => {
    try {
        const response = await axiosInstance.get("/listings/allListings/");
        return response.data?.data;
    } catch (error) {
        console.error("Error in fetchListings", error);
        return null;
    }
}

export const fetchListings = async ({ queryKey }) => {
    const [_key, { page, filters }] = queryKey;
    const params = { page, ...filters };

    // Remove empty filters
    Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] == null) {
            delete params[key];
        }
    });

    const { data } = await axiosInstance.get("listings/", { params });
    return data;
};

// Reviews
export const fetchAllReviews = async (filters = {}) => {
    try {
        const params = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
                params[key] = filters[key];
            }
        });
        const response = await axiosInstance.get('/reviews/admin/get_reviews', { params });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching reviews: ", error);
        return { reviews: [] };
    }
}

export const getReviewsByListingId = async (listingId) => {
    try {
        const response = await axiosInstance.get(`/reviews/`, {
            params: { listing: listingId },
        });
        return response.data;
    } catch (error) {
        console.log("Error in getReviewsByListingId:", error);
        return null;
    }
};

export const getReviewSentiment = async (comment) => {
    try {
        const response = await axiosInstance.post("/ml/predict/", {
            comment: comment,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getReviewSentiment:", error);
        return null;
    }
};


export const submitReview = async ({ review }) => {
    try {
        const response = await axiosInstance.post(`/reviews/create/`, review);
        return response.data;
    } catch (error) {
        console.log("Error in submitReview:", error);
        return null;
    }
};

// Bookmarks
export const getBookmarksByListingId = async (listingId) => {
    try {
        const response = await axiosInstance.get(`/bookmarks/`, {
            params: { listing: listingId },
        });
        return response.data;
    } catch (error) {
        console.log("Error in getBookmarksByListingId:", error);
        return null;
    }
};

export const getBookmarksByUserId = async (userId) => {
    try {
        const response = await axiosInstance.get(`/bookmarks/`, {
            params: { user: userId },
        });
        return response.data;
    } catch (error) {
        console.log("Error in getBookmarksByListingId:", error);
        return null;
    }
};

export const toggleBookmark = async ({ listingId }) => {
    try {
        const response = await axiosInstance.post("/bookmarks/toggle/", { listing: listingId });
        return response.data;
    }
    catch (error) {
        console.log("Error in toggleBookmark:", error);
        return null;
    }
};

// For Multistep Form Data -> For ProfileSetup 
export const updateProfile = async (formData) => {
    try {
        return axiosInstance.put(`auth/profileSetup/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        console.log("Error in updateProfile:", error);
        return null;
    }
};

// For More than one User -> Handled By Amdin Panel
export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/auth/users/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getUsers:", error);
        return null;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/auth/users/delete/${userId}/`);
        return response.data;
    }
    catch (error) {
        console.log("Error in getUsers:", error);
        return null;
    }
}

// For Admin Panel
export const getUsersGrowthStats = async () => {
    try {
        const response = await axiosInstance.get('/auth/userStats/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getUsersGrowthStats:", error);
        return null;
    }
}

export const getListingsGrowthStats = async () => {
    try {
        const response = await axiosInstance.get('/listings/listingsStats/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getListingsGrowthStats:", error);
        return null;
    }
}

export const getReviewsGrowthStats = async () => {
    try {
        const response = await axiosInstance.get('/reviews/reviewsStats/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getReviewsGrowthStats:", error);
        return null;
    }
}

export const getAdminStats = async () => {
    try {
        const response = await axiosInstance.get('/listings/adminStats/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getAdminStats:", error);
        return null;
    }
}

export const getRecentReviews = async () => {
    try {
        const response = await axiosInstance.get('/reviews/recentReviews/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getRecentReviews:", error);
        return null;
    }
}

export const getRecentUsers = async () => {
    try {
        const response = await axiosInstance.get('/auth/recentUsers/');
        return response.data?.data;
    }
    catch (error) {
        console.log("Error in getRecentUsers:", error);
        return null;
    }
}

// for getting the current logged in user
export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get('/auth/user/');
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export const getUserReviewCount = async () => {
    try {
        const response = await axiosInstance.get('reviews/user/count');
        return response.data.count;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

export const getUserBookmarkCount = async () => {
    try {
        const response = await axiosInstance.get('bookmarks/user/count');
        return response.data.count;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

export const fetchRecentBookmarks = async () => {
    try {
        const response = await axiosInstance.get('/bookmarks/user/recent');
        return response.data.bookmarks;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const getUserReviews = async () => {
    try {
        const response = await axiosInstance.get('reviews/user/reviews');
        return response.data.reviews;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchRecommendedListings = async () => {
    try {
        const response = await axiosInstance.get('/listings/recommendedListings/');
        return response.data.listings || [];
    } catch (err) {
        console.log(err);
        return [];
    }
}