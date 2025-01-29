const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const noteSchema = new Schema({

    title: {type:String , required :true},
    content: {type:String , required :true},
    created_at: {type:String , required :true},
    creator:{type:mongoose.Types.ObjectId , required :true , ref: 'User'},

});

module.exports =mongoose.model('Note',noteSchema);