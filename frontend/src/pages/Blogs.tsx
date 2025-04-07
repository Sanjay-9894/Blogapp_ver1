import { BlogCard } from "../components/BlogCard"
import {Appbar} from "../components/Appbar"
import { useBlogs } from "../hooks"
import { BlogSkeleton } from "../components/BlogSkeleton";

export const Blogs =() =>{
    const {loading,blogs }= useBlogs();
    console.log(blogs)

    if (loading){
        return <div>
          <Appbar/>
          <div className="flex justify-center">
            <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            </div>
            
          </div>
        </div>
      }
  

    if (!blogs) {
        return <div>No blogs found</div>
    }

    return(
        <div>
            <Appbar/>

            <div className="flex justify-center">
                <div className="">
                    {blogs.map(blog => (
                        <BlogCard
                            key={blog.id}
                            id = {blog.id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedDate={"24th March"}
                        />
                    ))}   
                </div> 
            </div>
        </div>
        
    )
}