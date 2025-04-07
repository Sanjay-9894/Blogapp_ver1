import { Link } from "react-router-dom";

interface BlogCardProps {
    id :string;
    authorName : string;
    title: string;
    content : string;
    publishedDate : string;
}

export const BlogCard =({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardProps) =>{
    
    return(
        <div>
            <Link to={`/blog/${id}`}>
                <div className="p-4 border-b border-slate-300 pb-4 w-screen max-w-screen-md cursor-pointer">
                
                    <div className="flex">
                        <div className="">
                            <Avatar name = {authorName}
                            size = {"small"}/>
                        </div>
                        <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
                            {authorName}
                        </div>
                        <div className="pl-2 flex justify-center flex-col mt-1">
                            <Circle/>
                        </div>
                        <div className="text-sm pl-2 font-thin flex justify-center flex-col text-slate-500">
                        {publishedDate}
                        </div>
                    </div>

                    <div className="font-bold text-2xl pt-2">
                        {title}
                    </div>

                    <div className="pt-2">
                        {content.slice(0,100) + "..."}
                    </div>

                    <div className="pt-4">
                        {`${Math.ceil(content.length/100)} minutes`}
                    </div>

                </div>
            </Link>

        </div>
       

    )
    
}

interface Name{
    name : string;
    size:"small" | "big"
}

export function Avatar({ name, size= "small"}: Name){
    return <div className={`relative inline-flex items-center justify-center 
    overflow-hidden bg-gray-400 rounded-full ${size === "small" ? "w-6 h-6": "w-10 h-10"}`}>
        
        <span className={`${size === "small" ? "text-xs" : "text-md"} font-small text-gray-900 dark:text-gray-300`}>
            {name[0]}
        </span>
    </div>
    
}

export function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}
