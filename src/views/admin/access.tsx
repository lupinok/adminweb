import { useEffect, useState } from 'react';
import { Result } from "antd";
import { useAuth } from '../../hooks/useAuth';
import { IPermission } from 'views/admin/permission/components/modal.permission';

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: {
        module: string;
        method: string;
        apiPath: string;
    };
}

const Access = (props: IProps) => {
    const { permission, hideChildren = false } = props;
    const [allow, setAllow] = useState<boolean>(false);
    const { admin } = useAuth(); // Giả sử useAuth hook có thông tin về permissions của user

    useEffect(() => {
        if (admin?.role?.permissions?.length) {
            // Kiểm tra quyền truy cập
            const check = admin.role.permissions.find((item: IPermission) =>
                item.module === permission.module &&
                item.apiPath === permission.apiPath &&
                item.method === permission.method
            );

            // Kiểm tra wildcard permission cho module
            const hasModuleWildcard = admin.role.permissions.find((item: IPermission) =>
                item.module === permission.module &&
                item.apiPath === '*' &&
                item.method === '*'
            );

            setAllow(!!check || !!hasModuleWildcard);
        }
    }, [admin?.role?.permissions, permission]);

    // Kiểm tra nếu ACL được tắt trong môi trường development
    const isAclDisabled = process.env.REACT_APP_ACL_ENABLE === 'false';

    if (isAclDisabled || allow) {
        return <>{props.children}</>;
    }

    // Nếu hideChildren = true, không hiển thị gì cả
    if (hideChildren) {
        return null;
    }

    // Hiển thị thông báo không có quyền truy cập
    return (
        <Result
            status="403"
            title="Truy cập bị từ chối"
            subTitle="Xin lỗi, bạn không có quyền truy cập chức năng này"
        />
    );
};

export default Access;