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

export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/user/');
        return response.data;
    }
    catch (error) {
        console.log("Error in getUsers:", error);
        return null;
    }
}

// Listings
export const fetchListings = async () => {
    try {
        const response = await axiosInstance.get("/listings/");
        return response.data;
    } catch (error) {
        console.error("Error in fetchListings", error);
        return null;
    }
}