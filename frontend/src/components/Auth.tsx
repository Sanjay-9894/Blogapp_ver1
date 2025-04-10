import {SignupInput } from "@sanjay_raj76/medium";
import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";


export const Auth =({ type } : {type:"signup" | "signin"}) =>{

    const [postInputs, setPostInputs] = useState<SignupInput>({
        name : "",
        username : "",
        password : ""
    });

    const navigate = useNavigate()

    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup": "signin"}`, postInputs)
            if (response.data.token) {
                localStorage.setItem("Token", response.data.token);
                navigate("/blogs");
            }

        }catch(e){
            alert("Error while Signing up")

        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            Create an account
                        </div>
                        <div className="text-slate-500 pt-2">
                            {type === "signin" ? "Don't have an account" : "Already have an account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign In"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-2">
                        {type === "signup" ?<LabelledInput label ="Name" placeholder="sanjay raj" onChange ={(e) =>{
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value
                                })
                        }}/> : null}

                        <LabelledInput label ="Username" placeholder="sanjay@gmail.com" onChange ={(e) =>{
                                setPostInputs({
                                    ...postInputs,
                                    username: e.target.value
                                })
                         }}/>

                        <LabelledInput label ="Password" type = {"password"} placeholder="123456" onChange ={(e) =>{
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                                })
                        }}/>
                    </div>
                    <button onClick = {sendRequest} type="button" className="mt-6 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                   
                </div>
            </div>

        </div>
    );
};

interface LabelledInputType{
    label : string,
    placeholder : string,
    onChange: (e : React.ChangeEvent<HTMLInputElement>) => void;
    type? :string
}

function LabelledInput({label, placeholder, onChange, type}: LabelledInputType){
    return (
    <div>

        <label className="block mb-2 text-xl font-semibold text-gray-800 pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
      
    </div>

)}