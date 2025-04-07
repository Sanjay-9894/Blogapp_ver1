import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, signupInput, updateBlogInput } from "@sanjay_raj76/medium";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { auth } from "hono/utils/basic-auth";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL :string,
        JWT_SECRET : string
    },
    Variables :{
        userId :string
    }
}>();

blogRouter.use("/*", async (c,next) =>{

    const authHeader = c.req.header("Authorization");

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return c.json({
            message : "Unauthorized :Token missing"
        })
    }

    const token = authHeader.split(" ")[1];

    try{
        const user = await verify(token, c.env.JWT_SECRET);
        //@ts-ignore
        c.set("userId", user.id);
        await next();

    }catch(e){
        console.log(e);
        return c.json({ message: "Unauthorized: Invalid token" }, 403);
    }
})

blogRouter.post('/', async (c) =>{

    const prisma = new PrismaClient({
        datasourceUrl: (c.env as {DATABASE_URL : string}).DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const authorId = c.get("userId");
    const { success } = createBlogInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    
    try{
        const post = await prisma.post.create({
            data:{
                title: body.title,
                content : body.content,
                authorId :authorId
            }

        })

        return c.json({
            id: post.id
        })

    }catch(e){
        console.log(e);
        return c.json({
            error: "Failed to post the blog"
        })
    }
})

blogRouter.put('/', async (c) =>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

    // const { success } = updateBlogInput.safeParse(body);
	// if (!success) {
	// 	c.status(400);
	// 	return c.json({ error: "invalid input" });
	// }
    

    try{
        const updatedPost = await prisma.post.update({
            where:{
                id:body.id,
            },
            data:{
                content : body.content,
                title: body.title,
            }
        })

        return c.json({
            message: "Post updated successfully",
            post :updatedPost
        })

    }catch(e){
        console.log(e);
        return c.json({
            error: 'Failed to update the blog'
        })
    }
})

// I should add pagination to this endpoint because user needs to see first 10posts,
// if those guys scroll down then they should get all the other posts

blogRouter.get('/bluk', async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const posts = await prisma.post.findMany({
            include :{
                author:{
                    select:{
                        name :true,
                    }
                }
            }
        });

        return c.json({
            posts
        })

    }catch(e){
        console.log(e);
        return c.json({
            error: 'Failed to load Posts'
        })
    }
})

blogRouter.get('/:id', async(c) =>{
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param("id")

    try{
        const post = await prisma.post.findFirst({
            where:{
                id:id,
            },
            select:{
                id : true,
                title : true,
                content : true,
                author:{
                    select:{
                        name: true,
                    }
                }
            }
        })

        return c.json({
            post
        })

    }catch(e){
        console.log(e);
        return c.json({
            error: 'Failed to get the post'
        })
    }
})