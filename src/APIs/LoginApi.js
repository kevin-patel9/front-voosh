import { commonEndPoint, postData } from "../common/Apicall";

export const registerUserApi = async (userId, name, password) => {
    return await postData("/api/v1/user/register", { userId, name, password });
};

export const loginUserApi = (userId, password) => {
    try {
        fetch(`${commonEndPoint}/api/v1/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                password
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            document.cookie = `token=${data.token}; path=/`;
        })
        .catch((error) => console.error(error));
    } catch (e) {
        console.log(e);
    }
};