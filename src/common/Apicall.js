export const commonEndPoint = process.env.REACT_APP_END_POINT;

export function getCookie(name) {
    const cookieValue = document.cookie.match(
        "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
}

export const postData = async (endPoint = '', data = {}, formData = false) => {
    const url = commonEndPoint + endPoint;
    const token = getCookie("token");

    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    const value = formData ? data : JSON.stringify(data)

    try {
        let response = {};
        response = await fetch(url, {
            headers,
            body: value,
            method: 'POST',
        });
        return response.json();
    } catch (e) {
        console.log('error on POST -> ', e);
    }
}

export const getData = async (endPoint = '') => {
    const url = commonEndPoint + endPoint;
    const token = getCookie("token");

    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    try {
        const response = await fetch(url, {
            headers,
            method: 'GET'
        });
        return response.json();
    } catch (e) {
        console.log('error on GET -> ', e);
    }
};

export const deleteData = async (endPoint = '', data = {}) => {
    const url = commonEndPoint + endPoint;

    const token = getCookie("token");

    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (e) {
        console.log('error on DELETE -> ', e);
    }
}