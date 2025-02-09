import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { useState, useEffect } from "react";
import { DebounceSelect } from "../components/debouce.select";
import { API_BASE_URL } from "service/api.config";

export interface IAdmin {
    id?: number;
    name: string;
    email: string;
    password?: string;
    field: number;
    role?: {
        id: number;
        name: string;
    }

    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IRoleOption {
    label: string;
    value: string;
}

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IAdmin | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}


const ModalAdmin = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<IRoleOption[]>([]);



    const [form] = Form.useForm();


    const submitAdmin = async (valuesForm: any) => {
        const { name, email, password, field, role } = valuesForm;
        if (dataInit?.id) {
            //update
            const admin = {
                id: dataInit.id,
                name,
                email,
                password,
                field,
                role: { id: role.value, name: "" }
            }

            const res = await fetch(`${API_BASE_URL}/api/v1/admins`, { // Thêm id vào URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(admin), // Gửi dữ liệu
            });

            const responseData = await res.json();

            if (res.ok) {
                message.success("Cập nhật admin thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: responseData.message || 'Lỗi không xác định',
                });
            }
        } else {
            //create
            const admin = {
                name,
                email,
                password,
                field,
                role: { id: role.value, name: "" }
            }
            const res = await fetch(`${API_BASE_URL}/api/v1/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(admin), // Gửi dữ liệu
            });

            const responseData = await res.json();
            if (res.ok) {
                message.success("Thêm mới admin thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: responseData.message || 'Lỗi không xác định',
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);
        setOpenModal(false);
    }


    async function fetchRoleList(name: string): Promise<IRoleOption[]> {
        const res = await fetch(`${API_BASE_URL}/api/v1/roles`);
        const data = await res.json();
        console.log("data", data);
        if (data) {

            const list = data.result;
            const temp = list.map((item: any) => {
                return {
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật User" : "Tạo mới User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitAdmin}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                    role: { label: dataInit.role?.name, value: dataInit.role?.id }
                } : {}}

            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?.id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?.id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Field"
                            name="field"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập field"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn công vai trò"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    setRoles(newValue as IRoleOption[]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>

                </Row>
            </ModalForm >
        </>
    )
}

export default ModalAdmin;
