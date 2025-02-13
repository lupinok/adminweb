export const ALL_PERMISSIONS = {
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
    },
    ADMINS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/admins', module: "ADMINS" },
        CREATE: { method: "POST", apiPath: '/api/v1/admins', module: "ADMINS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/admins', module: "ADMINS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/admins/{id}', module: "ADMINS" },
    },
}

export const ALL_MODULES = {
    PERMISSIONS: 'PERMISSIONS',
    ROLES: 'ROLES',
    ADMINS: 'ADMINS'
}
