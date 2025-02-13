import DataTable from "../permission/components/data.table";
import { IRole } from './components/modal.role';
import { IPermission } from '../permission/components/modal.permission';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
//import { callDeleteRole, callFetchPermission } from "@/config/api";

//import { fetchRole } from "@/redux/slice/roleSlide";
import ModalRole from "./components/modal.role";
import { ALL_PERMISSIONS } from "../permission/components/modules";
//import { sfLike } from "spring-filter-query-builder";
import { groupByPermission } from "../permission/components/color.method";
import { API_BASE_URL } from "service/api.config";

const RolePage = () => {

    const tableRef = useRef<ActionType>();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IRole | null>(null);
    const [dataSource, setDataSource] = useState<IRole[]>([]); // Khởi tạo state cho dataSource
    const [loading, setLoading] = useState<boolean>(true); // Khởi tạo state cho loading
    const [pageSize, setPageSize] = useState<number>(10); // Kích thước trang
    const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
    const [total, setTotal] = useState<number>(0); // Thêm state cho tổng số lượng bản ghi


    //all backend permissions
    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[]
    }[] | null>(null);

    //current role
    const [singleRole, setSingleRole] = useState<IRole | null>(null);

    useEffect(() => {
        reloadTable(); // Gọi lại khi component mount hoặc khi currentPage/pageSize thay đổi
    }, [currentPage, pageSize]);


    const handleDeleteRole = async (id: number | undefined) => {
        if (!id) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/roles/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                message.success('Xóa Role thành công');
                reloadTable();
            } else {
                const errorData = await res.json();
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: errorData.error || 'Không thể xóa permission'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi mạng',
                description: 'Không thể kết nối đến máy chủ'
            });
        }
        console.log("delete");
    }

    const reloadTable = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/roles?page=${currentPage}&size=${pageSize}`);
            const data = await res.json();
            setDataSource(data.result); // Cập nhật dataSource
            setTotal(data.meta.total); // Cập nhật tổng số lượng bản ghi 

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const columns: ProColumns<IRole>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {record.id}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
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
                            setSingleRole(entity);
                            setOpenModal(true);
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />

                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa role"}
                        description={"Bạn có chắc chắn muốn xóa role này ?"}
                        onConfirm={() => handleDeleteRole(entity.id)}
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
                </Space>
            ),

        },
    ];
    return (
        <div>

            <DataTable<IRole>
                actionRef={tableRef}
                headerTitle="Danh sách Roles (Vai Trò)"
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
                    showSizeChanger: true,
                }
                }
                rowSelection={false}
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Button
                            icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                            type="primary"
                            onClick={() => setOpenModal(true)}
                        >
                            Thêm mới
                        </Button>
                    );
                }}
            />
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                listPermissions={listPermissions!}
                singleRole={singleRole}
                setSingleRole={setSingleRole}
            />
        </div>
    )
}

export default RolePage;