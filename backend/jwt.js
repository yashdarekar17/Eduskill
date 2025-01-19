const jwt = require('jsonwebtoken')

const jwtwebmiddleware =(req,res,next)=>{
    
    const authorization= req.header.authorization
    if(!authorization)return res.status(401).json({error:'token not found'})

    const token = req.headers.authorization.split(' ')[1];
    if(!token)return res.status(401).json({error:'unauthorizated'})
    try{
      const decoded = jwt.verify(process.env.JWT_SECRET)
      req.user = decoded;
      next();
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'invalid token' });
    }
}

//FUNCTION GENETRATE token

const generatetoken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{ expiresIn: '2h' })

      
}


module.exports={jwtwebmiddleware,generatetoken}