const jwt = require('jsonwebtoken')

const jwtwebmiddleware =(req,res,next)=>{
    
     // Get token from Authorization header or cookies
     const authorization = req.headers.authorization;
     const token = authorization ? authorization.split(" ")[1] : req.cookies?.token;
     console.log("🔍 Received Token:", token); 
     if (!token) {
         return res.status(401).json({ error: "Token not found" });
     }
 
     try {
         // Verify JWT token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;  // Attach user info to request
         next();
     } catch (err) {
         console.error("JWT Error:", err);
         res.status(401).json({ error: "Invalid token" });
     }
}

//FUNCTION GENETRATE token

const generatetoken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{ expiresIn: '2h' })

      
}


module.exports={jwtwebmiddleware,generatetoken}