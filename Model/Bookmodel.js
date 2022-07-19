const mongoose = require('mongoose')

const bookdata = mongoose.Schema({
    bookphoto:{
        type: String,
        require: true,
    },
    title:{
        type: String,
        require: true
    },
    logline:{          
        incident:{
            type:String,            
        },
        protagonist:{
            type: String,            
        },
        action: {
            type: String
        },
        antagonist: {
            type: String
        }        
    },
    tagline: {
        type: String,
        require: true
    },
    synopsis: {
        type: String,
        require: true
    },
    writer:[{       
        writername: String,
        feature: String        
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId, ref:'Userdata',
        require: true
    },
    tags: [
        String
    ],
    genres:[],
    similar:[{
        bookId:String,
        bookphoto:String,
        title:String,
        synopsis:String,
    }],
    manuscript:[{
        ActTitle:String,
        Chapter:[{
            ChapterTitle:{type:String,default:"Please Enter A Chapter Title"},
            Description:{type:String,default:"Please Enter Description  "},
            writer:[{
                writername: String,
                feature: String 
            }]
        }]
    }] 
 
})

module.exports = mongoose.model("Book",bookdata)

// groups: [{
//     act:    
//       groupMembers: [{ 
//         type: Schema.Types.ObjectId, ref: "GroupMember" 
//         }],
//     }],