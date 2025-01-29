const express = require('express');
const {check}=require('express-validator');
const noteControllers = require('../controllers/notes-controllers');
const checkAuth= require('../middleware/check-auth');

const router=express.Router();

router.get('/:nid',noteControllers.getNoteById);
router.get('/user/:uid',noteControllers.getNotesByUserID);

//middleware
router.use(checkAuth);

router.post('/',[check('title').not().isEmpty(), check('content').isLength({min:5}),check('content').not().isEmpty()
],noteControllers.createNote);
router.patch('/:nid',[check('title').not().isEmpty(), check('content').isLength({min:5}),check('content').not().isEmpty()
],noteControllers.updateNoteByid);
router.delete('/:nid',noteControllers.deleteNote);


module.exports=router;
