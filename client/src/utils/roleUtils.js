const normalizeRoleValue = (value) => {
    if (!value) {
        return "";
    }

    if (Array.isArray(value)) {
        // Support authority arrays like ["ROLE_ADMIN"]
        return normalizeRoleValue(value[0]);
    }

    if (typeof value === "object") {
        return normalizeRoleValue(value.role || value.authority || "");
    }

    const role = String(value).trim().toUpperCase();
    return role.startsWith("ROLE_") ? role.slice(5) : role;
};

export const getCanonicalRole = (roleFromContext, roleFromStorage) => {
    return normalizeRoleValue(roleFromContext || roleFromStorage);
};

export const isAdminRole = (roleFromContext, roleFromStorage) => {
    return getCanonicalRole(roleFromContext, roleFromStorage) === "ADMIN";
};

