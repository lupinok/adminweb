import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";

type UserProfileProps = {
    user: {
        id: number;
        name: string;
        email: string;
        field: string;
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
    // Log dữ liệu nhận được
    console.log("User Data in UserProfile:", user);
    console.log("Courses Data in UserProfile:", courses);

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

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Chi Tiết</h2>
            {user ? (
                <>
                    <div className="mb-4"><strong>ID:</strong> {user.id}</div>
                    <div className="mb-4"><strong>Tên:</strong> {user.name}</div>
                    <div className="mb-4"><strong>Email:</strong> {user.email}</div>
                    <div className="mb-4"><strong>Lĩnh vực:</strong> {user.field}</div>
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
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border border-gray-200 p-2">{cell.getValue() as React.ReactNode}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserProfile;
