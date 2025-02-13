import { useAuth } from "hooks/useAuth";
import React, { useState } from "react";
import { API_BASE_URL } from "service/api.config";

interface Lesson {
    id: number;
    name: string;
    skillType: string;
}

interface LessonListProps {
    lessons: Lesson[];
    courseId: number;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, courseId }) => {
    const { token } = useAuth();
    const [selectedLessons, setSelectedLessons] = useState<number[]>([]);

    const toggleSelectLesson = (lessonId: number) => {
        setSelectedLessons(prevSelected =>
            prevSelected.includes(lessonId)
                ? prevSelected.filter(id => id !== lessonId)
                : [...prevSelected, lessonId]
        );
    };

    const handleAddToCourse = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/lessons`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessonIds: selectedLessons }), // Gửi danh sách ID bài học
            });
            const data = await res.json();

            if (res.ok) {
                alert("Add lesson success");
            } else {
                alert("Add lesson failed");
            }
        } catch (error) {
            console.error("Add lesson failed:", error);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-bold">Lesson List</h3>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Choose</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">ID</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Skill Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map((lesson) => (
                            <tr key={lesson.id}>
                                <td className="border-b border-gray-200 py-3 pr-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedLessons.includes(lesson.id)}
                                        onChange={() => toggleSelectLesson(lesson.id)}
                                    />
                                </td>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.id}</td>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.name}</td>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.skillType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={handleAddToCourse}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default LessonList;