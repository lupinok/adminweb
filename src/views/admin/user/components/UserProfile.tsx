import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import { useAuth } from "hooks/useAuth";
import { API_BASE_URL } from "service/api.config";
import { List, Card, Button } from "antd";

type UserProfileProps = {
    user: {
        id: number;
        name: string;
        email: string;
        speciField: string;
        englishlevel: string;
    };
    courses: {
        id: number;
        name: string;
        intro: string;
        diffLevel: number;
        recomLevel: number;
        courseType: string;
        speciField: string;
    }[];
};

const UserProfile: React.FC<UserProfileProps> = ({ user, courses }) => {
    const { token } = useAuth();
    const [lessons, setLessons] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    const columns = React.useMemo<ColumnDef<typeof courses[number]>[]>(() => [
        { accessorKey: "id", header: () => "ID" },
        { accessorKey: "name", header: () => "Tên Khóa Học" },
        { accessorKey: "intro", header: () => "Giới Thiệu" },
        { accessorKey: "diffLevel", header: () => "Mức Độ Khó" },
        { accessorKey: "recomLevel", header: () => "Mức Độ Đề Xuất" },
        { accessorKey: "courseType", header: () => "Loại Khóa Học" },
        { accessorKey: "speciField", header: () => "Lĩnh Vực Chuyên Môn" },
    ], []);

    const table = useReactTable({
        data: courses,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const fetchLessonsByCourseId = async (courseId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const lessonIds = data.data.lessonIds;

            const lessonDetails = await Promise.all(
                lessonIds.map(async (id: number) => {
                    const lessonResponse = await fetch(`${API_BASE_URL}/api/v1/lessons/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const lessonData = await lessonResponse.json();
                    return lessonData.data;
                })
            );

            setLessons(lessonDetails);
            setSelectedCourseId(courseId);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const handleViewLessons = (courseId: number) => {
        fetchLessonsByCourseId(courseId);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Chi Tiết</h2>
            {user ? (
                <>
                    <div className="mb-4"><strong>ID:</strong> {user.id}</div>
                    <div className="mb-4"><strong>Tên:</strong> {user.name}</div>
                    <div className="mb-4"><strong>Email:</strong> {user.email}</div>
                    <div className="mb-4"><strong>Lĩnh vực:</strong> {user.speciField}</div>
                    <div className="mb-4"><strong>Trình độ tiếng Anh:</strong> {user.englishlevel}</div>
                </>
            ) : (
                <div>No user data available</div>
            )}

            <h3 className="text-xl font-bold mt-6 mb-4">Khóa Học Đã Học</h3>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="border border-gray-200 p-2 text-left">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                            <th key="actions" className="border border-gray-200 p-2 text-left"></th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border border-gray-200 p-2">{cell.getValue() as React.ReactNode}</td>
                            ))}
                            <td key={row.id} className="border border-gray-200 p-2 text-left">
                                <Button type="link" onClick={() => handleViewLessons(row.original.id)}>Xem</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedCourseId && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Danh Sách Bài Học </h3>
                        <Button type="link" onClick={() => setSelectedCourseId(null)}>Ẩn</Button>
                    </div>
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        dataSource={lessons}
                        renderItem={lesson => (
                            <List.Item>
                                <Card title={lesson.name} style={{ height: 150 }}>
                                    <p>{lesson.skillType}</p>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
