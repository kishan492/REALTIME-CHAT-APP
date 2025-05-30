import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    })
    console.log("Generated JWT token:", token); // Debugging
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,  //prevent xss attacks cross site scripting attacks
        sameSite:process.env.NODE_ENV === "development" ? "lax" : "none", //csrf attacks cross-site request forgery attack
        secure:process.env.NODE_ENV !== "development",
    })
    return token; 
}