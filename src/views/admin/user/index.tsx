import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import { API_BASE_URL } from "service/api.config";
import { useAuth } from "hooks/useAuth";

const UserProfilePage: React.FC = () => {
    const { token } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [coursesData, setCoursesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Fetched User ID:", userId);

        if (!userId) {
            console.error("User ID is undefined or empty");
            setError("Invalid User ID");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const userData = await userResponse.json();

                console.log("User Data:", userData);

                const coursesResponse = await fetch(`${API_BASE_URL}/api/v1/courses`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const coursesData = await coursesResponse.json();

                console.log("Courses Data:", coursesData);

                // Cập nhật state với dữ liệu nhận được
                setUserData(userData);
                setCoursesData(coursesData.data.content || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log("User Data before passing to UserProfile:", userData, coursesData);

    return (
        <div className="p-6">

            <UserProfile user={userData} courses={coursesData} />

        </div>
    );
};

export default UserProfilePage;
