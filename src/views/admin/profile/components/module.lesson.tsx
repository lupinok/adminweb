import { Lesson } from "./LessonList";
import { FooterToolbar, ModalForm, ProCard, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "service/api.config";
import { CheckSquareOutlined } from "@ant-design/icons";
import { useAuth } from "hooks/useAuth";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    listLesson: Lesson | null;
    setListLesson: (v: Lesson) => void;
}

const ModuleLesson = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, listLesson, setListLesson } = props;
    const [form] = Form.useForm();
    const { token } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

    useEffect(() => {
        if (listLesson) {
            form.setFieldsValue({
                name: listLesson.name,
                skillType: listLesson.skillType,
                questionIds: listLesson.questionIds,
            });
            setSelectedQuestionIds(listLesson.questionIds || []);
        }
    }, [listLesson, form]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/questions?page=1&size=10&point=5`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                const filteredQuestions = data.data.content
                    .filter((q: any) => q.skillType === listLesson?.skillType)
                    .map((q: any) => ({
                        label: q.quesContent,
                        value: q.id,

                    }));
                setQuestions(filteredQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [token, selectedQuestionIds]);

    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
        setListLesson(null);
    }
    const handleQuestionChange = async (newSelectedIds: number[]) => {
        const addedIds = newSelectedIds.filter(id => !selectedQuestionIds.includes(id));
        const removedIds = selectedQuestionIds.filter(id => !newSelectedIds.includes(id));

        if (addedIds.length > 0) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/lessons/${listLesson?.id}/questions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ questionIds: addedIds }),
                });

                if (response.ok) {
                    message.success("Thêm câu hỏi thành công");
                } else {
                    const data = await response.json();
                    message.error(`Thêm câu hỏi thất bại: ${data.message}`);
                }
            } catch (error) {
                console.error("Error adding question:", error);
                message.error("Thêm câu hỏi thất bại");
            }
        }

        if (removedIds.length > 0) {
            try {
                for (const questionId of removedIds) {
                    const response = await fetch(`http://localhost:8080/api/v1/lessons/${listLesson?.id}/questions`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ questionId }),
                    });

                    if (response.ok) {
                        message.success(`Xóa câu hỏi ${questionId} thành công`);
                    } else {
                        const data = await response.json();
                        message.error(`Xóa câu hỏi ${questionId} thất bại: ${data.message}`);
                    }
                }
            } catch (error) {
                console.error("Error removing question:", error);
                message.error("Xóa câu hỏi thất bại");
            }
        }

        setSelectedQuestionIds(newSelectedIds);
    };
    const submitLesson = async (values: any) => {
        const { name, skillType, questionIds } = values;
        const lesson = {
            name,
            skillType
        }
        console.log("lesson", lesson);
        if (listLesson?.id) {
            const res = await fetch(`${API_BASE_URL}/api/v1/lessons/${listLesson.id}`, {
                method: "PUT",
                body: JSON.stringify(lesson),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await res.json();
            if (res.ok) {
                message.success("Cập nhật lesson thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: data.message
                });
            }
        } else {
            const res = await fetch(`${API_BASE_URL}/api/v1/lessons`, {
                method: "POST",
                body: JSON.stringify(lesson),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await res.json();
            if (res.ok) {
                message.success("Tạo mới lesson thành công");
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
    return (
        <>
            <ModalForm
                title={<>{listLesson?.id ? "Cập nhật Lesson" : "Tạo mới Lesson"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{listLesson?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"

                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitLesson}

            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Lesson"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Skill Type"
                            name="skillType"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập skillType"
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            label="Danh sách câu hỏi"
                            name="questionIds"
                            options={questions}
                            mode="multiple"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ít nhất một câu hỏi' },
                            ]}
                            placeholder="Chọn câu hỏi"
                            onChange={handleQuestionChange}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}
export default ModuleLesson;