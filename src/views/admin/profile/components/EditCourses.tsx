import React, { useState, useEffect } from "react";
import { useAuth } from "hooks/useAuth";

interface EditCourseProps {
    courseId: number;
    onClose: () => void;
}

const EditCourse: React.FC<EditCourseProps> = ({ courseId, onClose }) => {
    const { token } = useAuth();
    const [courseData, setCourseData] = useState<any>({
        id: 0,
        name: "",
        intro: "",
        diffLevel: 0,
        recomLevel: 0,
        courseType: "",
        speciField: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/courses/${courseId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch course data");
                }
                const data = await response.json();
                console.log("data đằng trên", data);
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching course data:", error);
                setError("Failed to fetch course data");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/v1/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(courseData),
            });
            console.log("data ở dưới,", courseData);
            if (!response.ok) {
                throw new Error("Failed to update course");
            }

            alert("Course updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating course:", error);
            setError("Failed to update course");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>ID:</label>
                <input
                    type="number"
                    name="id"
                    value={courseData.id}
                    onChange={handleChange}
                    readOnly
                />
            </div>
            <div>
                <label>Tên khóa học:</label>
                <input
                    type="text"
                    name="name"
                    value={courseData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Giới thiệu:</label>
                <input
                    type="text"
                    name="intro"
                    value={courseData.intro}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Diff Level:</label>
                <input
                    type="number"
                    name="diffLevel"
                    value={courseData.diffLevel}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Recom Level:</label>
                <input
                    type="number"
                    name="recomLevel"
                    value={courseData.recomLevel}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Loại khóa học:</label>
                <input
                    type="text"
                    name="courseType"
                    value={courseData.courseType}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Special Field:</label>
                <input
                    type="text"
                    name="speciField"
                    value={courseData.speciField}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={onClose}>Đóng</button>
        </form>
    );
};

export default EditCourse;