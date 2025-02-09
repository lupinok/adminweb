import React from "react";

interface Lesson {
    id: number;
    name: string;
    skillType: string;
}

interface LessonListProps {
    lessons: Lesson[]; // Define the lessons prop
}

const LessonList: React.FC<LessonListProps> = ({ lessons }) => {
    return (
        <div>
            <h3 className="text-lg font-bold">Danh sách bài học</h3>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">ID</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">SkillType</th>
                            <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map((lesson) => (
                            <tr key={lesson.id}>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.id}</td>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.name}</td>
                                <td className="border-b border-gray-200 py-3 pr-4">{lesson.skillType}</td>
                                <td className="border-b border-gray-200 py-3 pr-4">
                                    <button className="text-blue-500 hover:underline mr-2">Thêm câu hỏi</button>
                                    <button className="text-yellow-500 hover:underline mr-2">Thêm vào khóa học</button>
                                    <button className="text-red-500 hover:underline">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LessonList;