const mongoose = require('mongoose')

const seriesdata = mongoose.Schema({    
    files:[{
        type: String,
        require: true,
    }],
    title:{
        type: String,
        unique:true,
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
    actor:[{
        actorphoto:String,        
        actorname: String,           
        heroname:  String,            
        description: String        
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
        seriesId:String,
        files:[String],
        title:String,
        synopsis:String,
    }],
    screenplay:[{
        SeasonName:String,
        Description:String,
        Episodes:[{
            EpisodeTitle:String,
            Act:[{
                ActName:String,
                Scene:[{
                    SceneTitle:{type:String,default:'Please Enter Scene Title'},
                    Description:{type:String,default:'Please Enter Description'},
                    Actors:[{
                        actorphoto:String,
                        actorname:String,
                        heroname:String,
                        description:String
                    }]
                }]
            }]
        }]
    }]
 
})

module.exports = mongoose.model("Series",seriesdata)


