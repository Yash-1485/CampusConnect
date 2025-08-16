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
export const fetchAllListings = async () => {
    try {
        const response = await axiosInstance.get("/listings/allListings/");
        return response.data;
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

// export const updateProfile = async (data) => {
//     try {
//         const formData = data;
//         return axiosInstance.put(`auth/profile/`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             }
//         }
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };

// For Multistep Form Data -> For ProfileSetup 
export const updateProfile = async (formData) => {
    return axiosInstance.put(`auth/profile/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// For More than one User -> Handled By Amdin Panel
export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/auth/users/');
        // console.log(response.data)
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