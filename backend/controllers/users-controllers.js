const HttpError=require('../models/http-error');
const {validationResult}= require('express-validator');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const User=require('../models/user');


const getUsers=async(req,res,next)=>{
    let users;
    try {
        users= await User.find({},'-password');
      
         } catch (err){
             const error=new HttpError('Someting went wrong.. fetching users failed! please try again ..',500);
             return next(error);
         }
  
      res.json({users: users.map(user => user.toObject({getters:true}))});

} ;


const signup =async(req,res,next)=>{

    const errors=validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data !!',422);
    }
    const {name,email,password}=req.body;


    let userExist;

    try {
        userExist= await User.findOne({email:email});
    
       } catch (err){
           const error=new HttpError('Someting went wrong! please try again ..',500);
           return next(error);
       }

    if(userExist){
        return next(new HttpError('User does exist!',422)) ;
    }

    let hashedPassword ;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error= new HttpError('Could not create user ! Please try again',500);
        return next(error);
    }

    const createdUser=new User({
        name,
        email,
        password: hashedPassword,
        notes : []
    });

    try {
     await createdUser.save();
    } catch (err){
        const error=new HttpError('Signing up failed! please try again ..',500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({userId: createdUser.id, email: createdUser.email},'secret',{expiresIn:'1h'});
        
    }catch(err){
        const error=new HttpError('Signing up failed! please try again ..',500);
        return next(error);
    }
   
    res.status(201).json({userId:createdUser.id, email: createdUser.email , token: token });
    
} ;


const login =async(req,res,next)=>{

    const {email,password}=req.body;

    let identifiedUser;

    try {
        identifiedUser= await User.findOne({email:email});
        
        console.log(identifiedUser);
    
       } catch (err){
           const error=new HttpError('Someting went wrong.. User do not exist! please try again ..',500);
           return next(error);
       }

    let isValidPassword=false;

    try{
        isValidPassword= await bcrypt.compare(password,identifiedUser.password);
        console.log(isValidPassword);
   
    }catch (err){
        const error=new HttpError('Invalid credentials, could not log you in!',(500));
        return next(error);
    }
    if(!isValidPassword){
        const error=new HttpError('Invalid credentials, could not log  you in!',403);
        return next(error);
    }

    
    let token;
    try{
        token = jwt.sign({userId: identifiedUser.id, email: identifiedUser.email},'secret',{expiresIn:'1h'});
        
    }catch(err){
        const error=new HttpError('Login failed! please try again ..',500);
        return next(error);
    }
   
    res.json({userId:identifiedUser.id, email: identifiedUser.email , token: token });
    
} ;

exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;