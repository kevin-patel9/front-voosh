import { postData, deleteData } from "../common/Apicall";

export const createTaskApi = async (title, description) => {
    return await postData("/api/v1/task/createTask", {title, description});
};

export const updateTaskApi = async (taskId, title, description) => {
    return await postData("/api/v1/task/updateTask", {taskId, title, description});
};

export const updateTaskTypeApi = async (taskId, taskType) => {
    return await postData("/api/v1/task/changeTaskType", {taskId, taskType});
};

export const getAllTaskApi = async (sorted) => {
    return await postData(`/api/v1/task/getAllTask`, {sorted});
};

export const deleteTaskApi = async (taskId) => {
    return await deleteData("/api/v1/task/deleteTask", { taskId });
};
