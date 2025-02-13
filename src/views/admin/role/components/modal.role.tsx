import { IPermission } from "views/admin/permission/components/modal.permission";
import { FooterToolbar, ModalForm, ProCard, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { useEffect } from "react";
import { API_BASE_URL } from "service/api.config";
import ModuleApi from "./modal.api";
import { CheckSquareOutlined } from "@ant-design/icons";

export interface IRole {
    id?: number;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    listPermissions: {
        module: string;
        permissions: IPermission[]
    }[];
    singleRole: IRole | null;
    setSingleRole: (v: any) => void;
}
const ModalRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, listPermissions, singleRole, setSingleRole } = props;
    const [form] = Form.useForm();

    const submitRole = async (valuesForm: any) => {
        const { description, active, name, permissions } = valuesForm;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
                    checkedPermissions.push({ id: key });
                }
            }
        }

        if (singleRole?.id) {
            //update
            const role = {
                id: singleRole.id,
                name, description, active, permissions: checkedPermissions
            }
            const res = await fetch(`${API_BASE_URL}/api/v1/roles`, {
                method: "PUT",
                body: JSON.stringify(role)
            });
            const data = await res.json();
            console.log("dữ liệu role", data);
            if (res.ok) {
                message.success("Cập nhật role thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: data.message
                });
            }
        } else {
            //create
            const role = {
                id: singleRole.id,
                name, description, active, permissions: checkedPermissions
            }
            const res = await fetch(`${API_BASE_URL}/api/v1/roles`, {
                method: "POST",
                body: JSON.stringify(role)
            });
            const data = await res.json();
            if (res.ok) {
                message.success("Thêm mới role thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: data.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
        setSingleRole(null);
    }

    return (
        <>
            <ModalForm
                title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: 900,
                    keyboard: false,
                    maskClosable: false,

                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitRole}
                submitter={{
                    render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    },
                    searchConfig: {
                        resetText: "Hủy",
                        submitText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
                    }
                }}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Role"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSwitch
                            label="Trạng thái"
                            name="active"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>

                    <Col span={24}>
                        <ProFormTextArea
                            label="Miêu tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập miêu tả role"
                            fieldProps={{
                                autoSize: { minRows: 2 }
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProCard
                            title="Quyền hạn"
                            subTitle="Các quyền hạn được phép cho vai trò này"
                            headStyle={{ color: '#d81921' }}
                            style={{ marginBottom: 20 }}
                            headerBordered
                            size="small"
                            bordered
                        >
                            <ModuleApi
                                form={form}
                                listPermissions={listPermissions}
                                singleRole={singleRole}
                                openModal={openModal}
                            />

                        </ProCard>

                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}
export default ModalRole;