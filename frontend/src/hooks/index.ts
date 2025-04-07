import { useEffect, useState } from "react";
import axios from "axios"
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export interface Blog{
    "content" : string;
    "title" : string;
    "id" : string;
    "author" :{
        "name" :string
    }

}

export const useBlog = ({id} : {id :string}) => {
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<Blog>();

    const navigate = useNavigate();

    useEffect(() =>{
        const token = localStorage.getItem("Token");

        if(!token){
            console.log("No token found");
            setLoading(true);
            navigate("/signin");
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization :`Bearer ${token}`
            }
        })
        .then(response =>{
            setBlog(response.data.post);
            setLoading(false);

        })
        .catch(error =>{
            console.log("Error details",error);
            if (error.response?.status === 403) {
                localStorage.removeItem("Token");
                navigate("/signin");
            }
            setLoading(false);
        })
    },[navigate]);

    return {
        loading,
        blog
    }
}

export const useBlogs =() =>{
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const navigate = useNavigate(); // Add this if using react-router

    useEffect(() => {
        const token = localStorage.getItem("Token");
        console.log("Current token:", token); // Add this to debug

        if (!token) {
            console.error("No token found - redirecting to signin");
            setLoading(false);
            navigate("/signin");
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/blog/bluk`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("API Response:", response.data);
            setBlogs(response.data.posts);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error details:", error.response?.data);
            if (error.response?.status === 403) {
                localStorage.removeItem("Token");
                navigate("/signin");
            }
            setLoading(false);
        });
    }, [navigate]);


    console.log(blogs)



    return {
        loading,
        blogs
    }
}