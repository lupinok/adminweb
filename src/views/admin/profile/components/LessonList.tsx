import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "service/api.config";
import { message, Popconfirm } from "antd";
import ModuleLesson from "./module.lesson";
import { notification } from "antd";

export interface Lesson {
    id: number;
    name: string;
    skillType: string;
    questionIds: number[];
}

interface LessonListProps {
    lessons: Lesson[];
    courseId: number;
    fetchLessons: () => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, courseId, fetchLessons }) => {
    const { token } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonData, setLessonData] = useState<Lesson[]>(lessons);
    useEffect(() => {
        // Fetch lessons in the course and set them as selected
        const fetchCourseLessons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    const courseLessonIds = data.data.lessonIds;
                    console.log("courseLessonIds:", courseLessonIds);
                    console.log("lessonIds", courseLessonIds.lessonIds);
                    setSelectedLessons(courseLessonIds);
                }
            } catch (error) {
                console.error("Error fetching course lessons:", error);
            }
        };

        fetchCourseLessons();
    }, [courseId, token]);
    const toggleSelectLesson = async (lessonId: number) => {
        const isSelected = selectedLessons.includes(lessonId);

        if (isSelected) {
            // Gọi API để xóa bài học khỏi khóa học
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/lessons`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lessonId }),
                });

                if (response.ok) {
                    setSelectedLessons(prevSelected => prevSelected.filter(id => id !== lessonId));
                    message.success("Lesson removed successfully");
                    console.log("response", notification);
                } else {
                    notification.error({
                        message: "Error",
                        description: "Failed to remove lesson",
                        placement: "topRight",
                    });

                }
            } catch (error) {
                console.error("Error removing lesson:", error);
            }
        } else {
            // Gọi API để thêm bài học vào khóa học
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/lessons`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lessonIds: [lessonId] }),
                });
                console.log("response", response, "lessonid", lessonId);
                if (response.ok) {
                    setSelectedLessons(prevSelected => [...prevSelected, lessonId]);
                    notification.success({
                        message: "Success",
                        description: "Lesson removed successfully",
                        placement: "topLeft",
                    });
                } else {
                    notification.error({
                        message: "Error",
                        description: "Failed to add lesson",
                        placement: "topRight",
                    });
                }
            } catch (error) {
                console.error("Error adding lesson:", error);
            }
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setOpenModal(true);
    };
    return (
        <div className="mt-10">
            <h3 className="text-lg font-bold">Lesson List</h3>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Choose</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">ID</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Skill Type</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Action</th>
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
                                <td className="border-b border-gray-200 py-3 pr-4">
                                    <EditOutlined
                                        style={{
                                            fontSize: 20,
                                            color: '#ffa500',
                                        }}
                                        type=""
                                        onClick={() => {
                                            handleEditLesson(lesson)
                                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                    <Popconfirm
                                        placement="leftTop"
                                        title={"Xác nhận xóa role"}
                                        description={"Bạn có chắc chắn muốn xóa role này ?"}
                                        onConfirm={() => console.log("oke")}
                                        okText="Xác nhận"
                                        cancelText="Hủy"
                                    >
                                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                            <DeleteOutlined
                                                style={{
                                                    fontSize: 20,
                                                    color: '#ff4d4f',
                                                }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                        </span>
                                    </Popconfirm>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {openModal && (
                    <ModuleLesson
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        reloadTable={fetchLessons}
                        listLesson={selectedLesson}
                        setListLesson={setSelectedLesson}
                    />
                )}
            </div>
        </div>
    );
};

export default LessonList;