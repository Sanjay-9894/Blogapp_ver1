import {Hono} from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {sign} from "hono/jwt";
import { signinInput, signupInput } from "@sanjay_raj76/medium";


export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL :string,
        JWT_SECRET : string
    }

}>();

userRouter.post('/signup', async (c) =>{

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);

    if(!success){
        return c.json({
            error: "Invalid Input"
        },400)
    }
    
    try{
        const user = await prisma.user.create({
            data:{
                name: body.name,
                email : body.username,
                password: body.password
            }
        });

        const token = await sign({id:user.id},c.env.JWT_SECRET);
        c.header("Authorization",`Bearer ${token}`)
        return c.json({token},200);
    
    }catch(e){
        console.error(e);
        return c.status(403);
    }
})

userRouter.post('/signin',async (c) =>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  

    const email = body.username;
    const password = body.password;

    try{
        //Find user by email
        const user = await prisma.user.findUnique({
            where:{email:email},
        });

        if(!user){
            return c.json({
                error: 'User not found'
            },403)
        }

        if(user.password !== password){
            return c.json({
                error: 'Incorrect credentials'
            },403)
        }

        const token = await sign({email:user.email, id:user.id},c.env.JWT_SECRET)

        c.header("Authorization",`Bearer ${token}`);
        return c.json({
            message: "Login Successful",
            token
        })

    }catch(e){
        console.log(e);
        return c.status(403);
    }
})