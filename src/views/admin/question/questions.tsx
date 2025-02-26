import DataTable from "../permission/components/data.table";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification, Dropdown, Input } from "antd";
import { useState, useRef, useEffect } from 'react';
import ModalQuestion from "./components/module.question";
import { colorMethod } from "../permission/components/color.method";
import { API_BASE_URL } from "service/api.config";
import { IQuestion } from "./components/module.question";
import ModalUpload from "./components/module.upload";
import { useAuth } from "hooks/useAuth";
import { SearchOutlined } from "@ant-design/icons";

const QuestionPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalUpload, setOpenModalUpload] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IQuestion | null>(null);
    const [dataSource, setDataSource] = useState<IQuestion[]>([]); // Khởi tạo state cho dataSource
    const [loading, setLoading] = useState<boolean>(true); // Khởi tạo state cho loading
    const [pageSize, setPageSize] = useState<number>(10); // Kích thước trang
    const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
    const [total, setTotal] = useState<number>(0); // Thêm state cho tổng số lượng bản ghi
    const [uploadData, setUploadData] = useState<any>(null); // State để lưu dữ liệu upload
    const [lessonMap, setLessonMap] = useState<{ [key: number]: Array<{ id: number, name: string }> }>({});
    const [selectedFilters, setSelectedFilters] = useState({
        quesType: undefined,
        keyword: undefined,
        skillType: undefined
    });
    const reloadTable = async () => {
        setLoading(true);
        try {

            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
                point: '5'
            });
            if (selectedFilters.quesType) queryParams.append('quesType', selectedFilters.quesType);
            if (selectedFilters.skillType) queryParams.append('skillType', selectedFilters.skillType);
            if (selectedFilters.keyword) queryParams.append('keyword', selectedFilters.keyword);

            const res = await fetch(`${API_BASE_URL}/api/v1/questions?${queryParams}`);
            const data = await res.json();
            const resLesson = await fetch(`${API_BASE_URL}/api/v1/lessons`);
            const dataLesson = await resLesson.json();

            // Create a map of questionId to lesson information
            const questionLessonMap: { [key: number]: Array<{ id: number, name: string }> } = {};

            // Iterate through all lessons
            dataLesson.data.content.forEach((lesson: any) => {
                if (lesson.questionIds && Array.isArray(lesson.questionIds)) {
                    lesson.questionIds.forEach((qId: number) => {
                        if (!questionLessonMap[qId]) {
                            questionLessonMap[qId] = [];
                        }
                        questionLessonMap[qId].push({
                            id: lesson.id,
                            name: lesson.name
                        });
                    });
                }
            });
            console.log("questionLessonMap:", questionLessonMap);

            setLessonMap(questionLessonMap);
            setDataSource(data.data.content);
            console.log("data:", data.data.content);
            // Cập nhật dataSource
            setTotal(data.data.totalPages * 10);
            // Cập nhật tổng số lượng bản ghi 
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadTable(); // Gọi lại khi component mount hoặc khi currentPage/pageSize thay đổi
    }, [currentPage, pageSize, selectedFilters]);

    const tableRef = useRef<ActionType>();

    const handleDeleteQuestion = async (id: number | undefined) => {
        if (!id) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/questions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                message.success('Delete question successfully');
                reloadTable();
            } else {
                const errorData = await res.json();
                notification.error({
                    message: 'An error occurred',
                    description: errorData.error || 'Cannot delete question'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Network error',
                description: 'Cannot connect to server'
            });
        }
        console.log("delete");
    }

    const handleUploadClick = async (questionId: number) => {
        setOpenModalUpload(true); // Mở modal upload
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/material/questions/${questionId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log("res:", questionId);
            const data = await res.json();
            if (res.ok) {
                setUploadData(data.data);
            } else {
                notification.error({
                    message: 'Error fetching upload data',
                    description: data.message || 'Failed to fetch data'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Network error',
                description: 'Cannot connect to server'
            });
        }
    };

    const columns: ProColumns<IQuestion>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Question Content',
            dataIndex: 'quesContent',
            sorter: false,
        },
        {
            title: 'Question Type',
            dataIndex: 'quesType',
            filters: [
                { text: 'LISTENING', value: 'LISTENING' },
                { text: 'MULTIPLE', value: 'MULTIPLE' },
                { text: 'TEXT', value: 'TEXT' },
                { text: 'CHOICE', value: 'CHOICE' },
            ],
            filterMode: 'menu',
            filtered: true,
            onFilter: true,
            onFilterDropdownOpenChange: (visible) => {
                if (!visible) {
                    const selectedItem = document.querySelector('.ant-dropdown-menu-item-selected');
                    const filterValue = selectedItem?.getAttribute('data-menu-id')?.split('-').pop();
                    console.log("filterValue:", filterValue);
                    setSelectedFilters({
                        ...selectedFilters,
                        quesType: filterValue || undefined
                    });
                }
            }

        },
        {
            title: 'Skill Type',
            dataIndex: 'skillType',
            filters: [
                { text: 'LISTENING', value: 'LISTENING' },
                { text: 'READING', value: 'READING' },
                { text: 'WRITING', value: 'WRITING' },
                { text: 'SPEAKING', value: 'SPEAKING' },
            ],
            filterMode: 'menu',
            filtered: true,
            onFilter: true,
            onFilterDropdownOpenChange: (visible) => {
                if (!visible) {
                    const selectedItem = document.querySelector('.ant-dropdown-menu-item-selected');
                    const filterValue = selectedItem?.getAttribute('data-menu-id')?.split('-').pop();
                    console.log("filterValue:", filterValue);
                    setSelectedFilters({
                        ...selectedFilters,
                        skillType: filterValue || undefined
                    });
                }
            }
        },
        {
            title: 'Point',
            dataIndex: 'point',
            sorter: false,
        },
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search keyword"
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedKeys(value ? [value] : []);
                        }}
                        onPressEnter={(e) => {
                            confirm();
                            setSelectedFilters({
                                quesType: selectedFilters.quesType,
                                skillType: selectedFilters.skillType,
                                keyword: e.currentTarget.value
                            });
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm();
                                setSelectedFilters({
                                    quesType: selectedFilters.quesType,
                                    skillType: selectedFilters.skillType,
                                    keyword: selectedKeys[0]
                                });
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters?.();
                                setSelectedFilters({
                                    quesType: selectedFilters.quesType,
                                    skillType: selectedFilters.skillType,
                                    keyword: undefined
                                });
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            ),
        },
        {
            title: 'Lessons',
            dataIndex: 'id',
            width: 150,
            render: (_, record) => {
                const lessonNames = lessonMap[record.id] || [];

                const items = lessonNames.map((lessonInfo, index) => ({
                    key: index,
                    label: (
                        <span onClick={(e) => {
                            e.stopPropagation();
                            console.log({
                                questionId: record.id,
                                lessonId: lessonInfo.id,
                                lessonName: lessonInfo.name
                            });
                        }}>
                            {lessonInfo.name}
                        </span>
                    ),
                }));

                return lessonNames.length > 0 ? (
                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement="bottomLeft"
                        arrow
                        trigger={['hover']}
                        destroyPopupOnHide
                    >
                        <Button style={{ width: '100%' }}>
                            {`${lessonNames.length} Lesson${lessonNames.length > 1 ? 's' : ''}`}
                        </Button>
                    </Dropdown>
                ) : (
                    <span className="text-gray-400">No lessons</span>
                );
            },
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        type=""
                        onClick={() => {
                            setOpenModal(true);
                            setDataInit(entity);
                            console.log("entity:", entity);
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Popconfirm
                        placement="leftTop"
                        title={"Confirm delete question"}
                        description={"Are you sure you want to delete this question ?"}
                        onConfirm={() => handleDeleteQuestion(entity.id)}
                        okText="Confirm"
                        cancelText="Cancel"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </span>
                    </Popconfirm>
                    <UploadOutlined
                        style={{
                            fontSize: 20,
                            color: entity.quesType === 'LISTENING' ? '#ffa500' : '#d9d9d9',
                            cursor: entity.quesType === 'LISTENING' ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => {

                            if (entity.quesType === 'LISTENING') {
                                handleUploadClick(entity.id);
                                setDataInit(entity);
                            } else {
                                message.warning('Upload is only available for Listening questions.');
                            }
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Space>
            ),
        },
    ];
    return (
        <div>
            <DataTable<IQuestion>
                actionRef={tableRef}
                headerTitle="List Questions "
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: true }}
                pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    onChange: (page, size) => {
                        setCurrentPage(page); // Cập nhật trang hiện tại
                        setPageSize(size); // Cập nhật kích thước trang
                    },
                    showSizeChanger: true, // Cho phép thay đổi kích thước trang
                }}
                rowSelection={false}
                toolBarRender={
                    (_action, _rows): any => {
                        return (
                            <Button
                                icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Add
                            </Button>
                        );
                    }}
            />
            <ModalQuestion
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                singleQuestion={dataInit}
                setSingleQuestion={setDataInit}
            />

            <ModalUpload
                openModalUpload={openModalUpload}
                setOpenModalUpload={setOpenModalUpload}
                reloadTable={reloadTable}
                singleQuestion={dataInit}
                setSingleQuestion={setDataInit}
                uploadData={uploadData}

            />
        </div>
    )
}

export default QuestionPage;