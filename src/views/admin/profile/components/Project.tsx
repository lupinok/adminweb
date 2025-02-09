import React, { useState, useEffect } from "react";
import { MdModeEditOutline } from "react-icons/md";
import image1 from "assets/img/profile/image1.png";
import Card from "components/card";
import LessonList from "./LessonList";
import { useAuth } from "hooks/useAuth";
import EditCourse from "./EditCourses";

type RowObj = {
  id: number;
  name: string;
  intro: string;
  diffLevel: number;
  recomLevel: number;
  courseType: string;
  speciField: string;
};

interface ProjectProps {
  tableData: RowObj[];
}

const Project: React.FC<ProjectProps> = ({ tableData }) => {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [errorLessons, setErrorLessons] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const handleAddLesson = async () => {
    setShowModal(true);
    await fetchLessons();
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/lessons?page=1&size=10", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const data = await response.json();
      setLessons(data.data.content);
      console.log("dữ liệu lesson", data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setErrorLessons("Failed to fetch lessons");
    } finally {
      setLoadingLessons(false);
    }
  };
  const handleEdit = (id: number) => {
    setEditingCourseId(id);
  };
  const handleCloseEdit = () => {
    setEditingCourseId(null); // Đóng modal chỉnh sửa
  };

  const handleDelete = (row: RowObj) => {
    console.log("Delete:", row);
    // Thực hiện chức năng xóa
  };

  return (
    <Card extra={"w-full p-4 h-full"}>
      <div className="mb-8 w-full">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          All projects
        </h4>
        <p className="mt-2 text-base text-gray-600">
          Here you can find more details about your projects. Keep you user
          engaged by providing meaningful information.
        </p>
      </div>
      {/* Project 1 */}
      <div className="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex items-center">
          <div className="">
            <img className="h-[83px] w-[83px] rounded-lg" src={image1} alt="" />
          </div>
          <div className="ml-4">
            <p className="text-base font-medium text-navy-700 dark:text-white">
              Technology behind the Blockchain
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Project #1 .
              <a
                className="ml-1 font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                See product details
              </a>
            </p>
          </div>
        </div>
        <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
          <MdModeEditOutline />
        </div>
      </div>
      {showModal && (
        <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg h-4/4 w-2/4 max-w-4xl mt-10">
            <LessonList lessons={lessons} />
            <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Đóng
            </button>
          </div>
        </div>
      )}
      {editingCourseId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl mt-10">
            <EditCourse courseId={editingCourseId} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">ID</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Intro</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Diff Level</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Recom Level</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Course Type</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Special Field</th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-gray-200 py-3 pr-4">{row.id}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.name}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.intro}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.diffLevel}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.recomLevel}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.courseType}</td>
                <td className="border-b border-gray-200 py-3 pr-4">{row.speciField}</td>
                <td className="border-b border-gray-200 py-3 pr-4">
                  <button onClick={handleAddLesson} className="text-blue-500 hover:underline">Thêm bài học</button>
                  <button onClick={() => handleEdit(row.id)} className="text-yellow-500 hover:underline ml-2">Edit</button>
                  <button onClick={() => handleDelete(row)} className="text-red-500 hover:underline ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Card>
  );
};

export default Project;
