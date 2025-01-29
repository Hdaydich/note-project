const HttpError=require('../models/http-error');
const mongoose = require('mongoose');
const {validationResult}= require('express-validator');
const Note=require('../models/note');
const User =require('../models/user');

const getNoteById=async (req,res,next)=>{
    const noteId=req.params.nid;
    
    let note;

    try {
      note= await Note.findById(noteId);
    
       } catch (err){
           const error=new HttpError('Someting went wrong.. could not find a note! please try again ..',500);
           return next(error);
       }

    if(!note){
        const error = new HttpError('Could not find a note for the provided id',404);
    return next(error);
    }

    res.json({note: note.toObject({getters:true})});
};

const getNotesByUserID= async(req,res,next)=>{
    
    const userID=req.params.uid;

    // let notes;

    let userWithNotes;

    try {
        userWithNotes= await User.findById(userID).populate('notes');
        // notes= await Note.find({creator:userID});
    
       } catch (err){
           const error=new HttpError('Someting went wrong.. could not find a note for the provided user id! please try again ..',500);
           return next(error);
       }

    if(!userWithNotes|| userWithNotes.notes.length===0){
        const error = new HttpError('Could not find a note for the provided user id',404);
        return next(error);
    }
    
    res.json({notes: userWithNotes.notes.map(note=>note.toObject({getters:true}))});
};

const createNote= async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data !!',422);
    }
    const {title,content,created_at}=req.body;
    const createdNote=new Note({
        title,
        content,
        created_at,
        creator: req.userData.userId
    });

    let user;

    try {
        user= await User.findById(req.userData.userId);
    } catch (err){
        const error=new HttpError('creating note failed! please try again ..',500);
        return next(error);
    }

    if(!user){
        const error=new HttpError('Could not find user for provided id ..',500);
        return next(error);
    }

    try {

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdNote.save({session: sess});
    user.notes.push(createdNote);
    await user.save({session: sess});
    await sess.commitTransaction();

    } catch (err){
        const error=new HttpError('creating note failed! please try again ..',500);
        return next(error);
    }

    res.status(201).json({note:createdNote.toObject({getters:true})});
};

const updateNoteByid= async(req,res,next)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data !!',422);
    }
    const {title,content}=req.body;
    const noteId=req.params.nid;

    let updatedNote;

    try {
        updatedNote= await Note.findById(noteId);
    
    } catch (err){
        const error=new HttpError('Someting went wrong.. could not find a note! please try again ..',500);
        return next(error);
    }

    if(!updatedNote){
        const error = new HttpError('Could not find a note for the provided id',404);
        return next(error);
    }
    // console.log(updatedNote.creator.toString());
    // console.log(req.userData.userId);

    if (updatedNote.creator.toString() !== req.userData.userId)
    {
        const error = new HttpError('You are not allowed to edit this place !',401);
        return next(error);
    }

    updatedNote.title=title;
    updatedNote.content=content;

    try {
        await updatedNote.save();
    } catch (err){
        const error=new HttpError('Someting went wrong.. could not update a note! please try again ..',500);
        return next(error);
    }
    res.status(200).json({note: updatedNote.toObject({getters:true})});
};

const deleteNote= async(req,res,next)=>{
   
    const noteId=req.params.nid; 
    
    let note;

    try {
        note= await Note.findById(noteId).populate('creator');
    
    } catch (err){
        const error=new HttpError('Someting went wrong.. could not find a note! please try again ..',500);
        return next(error);
    }

    if(!note){
        const error = new HttpError('Could not find a note for the provided id',404);
        return next(error);
    }

    if (note.creator.id !== req.userData.userId)
        {
            const error = new HttpError('You are not allowed to delete this place !',401);
            return next(error);
        }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await note.deleteOne({session: sess});
        note.creator.notes.pull(note);
        await note.creator.save({session: sess});
        await sess.commitTransaction();
    
    } catch (err){
        const error=new HttpError('creating note failed! please try again ..',500);
        return next(error);
    }

    res.status(200).json({message: 'deleted note!!'});
};

exports.createNote= createNote;
exports.getNotesByUserID= getNotesByUserID;
exports.getNoteById= getNoteById;
exports.updateNoteByid= updateNoteByid;
exports.deleteNote= deleteNote;