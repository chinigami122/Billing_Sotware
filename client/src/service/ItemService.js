import axios from "axios";

const token = localStorage.getItem("token");

export const addItem = async (item) => {
    return await axios.post(
        "http://localhost:8080/api/v1.0/admin/items",
        item , {headers : {'Authorization' : `Bearer ${token}`}}
    );
};

export const deleteItem = async (itemId) => {
    return await axios.delete(
        `http://localhost:8080/api/v1.0/admin/${itemId}` , {headers : {'Authorization' : `Bearer ${token}`}}
    );
};

export const fetchItems = async () => {
    return await axios.get(
        "http://localhost:8080/api/v1.0/items" , {headers : {'Authorization' : `Bearer ${token}`}}
    );
};
