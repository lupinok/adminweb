import DataTable from "../permission/components/data.table";
//import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
//import queryString from 'query-string';
//import { fetchPermission } from "@/redux/slice/permissionSlide";
import ModalPermission from "../permission/components/modal.permission";
import { colorMethod } from "../permission/components/color.method";
import { API_BASE_URL } from "service/api.config";
//import { ALL_PERMISSIONS } from "../permission/components/modules";
interface IPermission {
    id?: number;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;

}
const PermissionPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const [dataSource, setDataSource] = useState<IPermission[]>([]); // Khởi tạo state cho dataSource
    const [loading, setLoading] = useState<boolean>(true); // Khởi tạo state cho loading
    const [pageSize, setPageSize] = useState<number>(10); // Kích thước trang
    const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
    const [total, setTotal] = useState<number>(0); // Thêm state cho tổng số lượng bản ghi
    const reloadTable = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/permissions?page=${currentPage}&size=${pageSize}`);
            const data = await res.json();
            setDataSource(data.result); // Cập nhật dataSource
            setTotal(data.meta.total); // Cập nhật tổng số lượng bản ghi 

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadTable(); // Gọi lại khi component mount hoặc khi currentPage/pageSize thay đổi
    }, [currentPage, pageSize]);

    const tableRef = useRef<ActionType>();

    const handleDeletePermission = async (id: string | undefined) => {
        if (!id) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/permissions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                message.success('Xóa Permission thành công');
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

    const columns: ProColumns<IPermission>[] = [
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
            title: 'Name',
            dataIndex: 'name',
            sorter: false,
        },
        {
            title: 'API',
            dataIndex: 'apiPath',
            sorter: false,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            sorter: false,
            render(dom, entity, index, action, schema) {
                return (
                    <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(entity?.method as string) }}>{entity?.method || ''}</p>
                )
            },
        },
        {
            title: 'Module',
            dataIndex: 'module',
            sorter: false,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: false,
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
            sorter: false,
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
                            setOpenModal(true);
                            setDataInit(entity);
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa permission"}
                        description={"Bạn có chắc chắn muốn xóa permission này ?"}
                        onConfirm={() => handleDeletePermission(entity.id?.toString())}
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
            <DataTable<IPermission>
                actionRef={tableRef}
                headerTitle="Danh sách Permissions "
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
                }
                }
                rowSelection={false}
                toolBarRender={
                    (_action, _rows): any => {
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
            <ModalPermission
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default PermissionPage;