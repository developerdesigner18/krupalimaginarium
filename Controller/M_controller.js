const { json } = require('body-parser');
const Movie = require('../Model/Moviemodel')



//CREATE A NEW MOVIE
module.exports.moviedata = async(req,res)=>{
    try {        
    const {title, logline, tagline, synopsis, actor, tags, genres, similar, screenplay} = req.body;              
    const logLine = JSON.parse(logline);
    const Actor = JSON.parse(actor);
    const Tags = JSON.parse(tags);
    const Genres = JSON.parse(genres);
    const Similar = JSON.parse(similar); 

        let screenplayObj = {}
        let act = []
        let scene = []        
        for (i=1;i<=4;i++)
        {
            act.push({
                ActTitle:`Act ${i}`,
                Scene: scene
            })
            for (j=1;j<=10;j++)
            {
                scene.push({
                    SceneTitle : `Scene ${j}`,
                    actors:[]
                });
            }
            scene = [];
        }        
        screenplayObj = Object.assign(act)        
    
    const movie = await Movie.findOne({title:req.body.title})
    if(movie){
        return res.status(404).json({code:404,message:"Moviename is already exists"})
    }
    const imagepath = "http://localhost:8888/images/" + req.file.filename; 
    const newmovie = await new Movie({
        author: req.user._id,
        title : title,
        moviebanner: imagepath,
        logline:{
            incident :logLine.incident,
            protagonist : logLine.protagonist,
            action : logLine.action,
            antagonist : logLine.antagonist,    
        },
        tagline : tagline,
        synopsis : synopsis,        
        actor : Actor,
        tags : Tags,
        genres : Genres,
        similar: Similar,
        screenplay : screenplayObj   
    });
    newmovie.save().then((result)=>{ 
        return res.status(200).json({code:200,message:"movie create successfully",result});
    }).catch((err)=>{
        return res.status(500).json({message:err.message});
    })              
} catch (error) {
    return res.status(500).json({code:500,error : error.message});
}   
}



//CREATE NEW ACTOR
module.exports.actor = async(req,res)=>{
    try {
        const {actorname,heroname,discription} = req.body;
        const photopath = "http://localhost:8888/images/actor/" + req.file.filename;                
        Actor = {
            actorphoto : photopath,
            actorname,
            heroname,
            discription
        }               
        return res.status(200).json({code:200,data:Actor})
    } catch (error) {
        return res.status(500).json({code:500,error : error.message});        
    }
}



//DELETE ACTOR IN MOVIE
module.exports.deleteactor = async(req,res)=>{
    try {
        const movie = await Movie.findById({_id: req.body.movieId})
        if(!movie){
            return res.status(404).json({code:404,message:"movie is not found"})
        }                     
        await Movie.findOneAndUpdate(
            {_id : req.body.movieId},
            { $pull: { actor: {_id: req.body.actorId}}},{ safe: true, multi: false })           
            .then((result)=>{        
                return res.status(200).json({code:200,message:"Actor delete Successfully"})
            }).catch((err)=>{
                return res.status(500).json({message:err.message});
            })              
        } catch (error) {
            return res.status(500).json({code:500,message:error.message});
        }
    }
    
    

//UPDATE MOVIE DETAIS
module.exports.updatemovie = async(req,res)=>{
        try{
            const {title,logline,tagline,synopsis,actor,tags,genres} = req.body;
            const movie = await Movie.findById({_id:req.body.movieId});                      
            const logLine = JSON.parse(logline);
            const Actor = JSON.parse(actor);
            const Tags = JSON.parse(tags);
            const Genres = JSON.parse(genres);       
            const imagepath = "http://localhost:8888/images/" + req.file.filename;
            if(movie.title == req.body.title){                 
                await Movie.findByIdAndUpdate(
                    {_id : req.body.movieId},
                    { $set: {
                        moviebanner:imagepath,
                        title:title,
                        logline:{
                            incident :logLine.incident,
                            protagonist : logLine.protagonist,
                            action : logLine.action,
                            antagonist : logLine.antagonist,    
                        },
                        tagline : tagline,
                        synopsis : synopsis,        
                        actor : Actor,
                        tags : Tags,
                        genres : Genres,                
                    }},{ safe: true, multi: false })           
                    .then(async(result)=>{                               
                        return res.status(200).json({code:200,result,message:"Movie Update Successfully"})
                    }).catch((err)=>{
                        return res.status(500).json({message:err.message});
                    })            
            }else{
                const find = await Movie.findOne({title:req.body.title})
                if(find){
                    return res.status(409).json({code:409,message:"This Moviename Is Alredy Exists"});
                }
                await Movie.findOneAndUpdate(
                    {_id : req.body.movieId},
                    { $set: {
                        moviebanner:imagepath,
                        title:title,                       
                        logline:{
                            incident :logLine.incident,
                            protagonist : logLine.protagonist,
                            action : logLine.action,
                            antagonist : logLine.antagonist,    
                        },
                        tagline : tagline,  
                        synopsis : synopsis,        
                        actor : Actor,
                        tags : Tags,
                        genres : Genres,                
                    }},{new:true,safe: true, multi: false })           
                    .then((result)=>{                              
                        return res.status(200).json({code:200,result,message:"Movie Update Successfully"})
                    }).catch((err)=>{
                        return res.status(500).json({message:err.message});
                    })            
            }        
        }catch(error){
            return res.status(500).json({code:500,message:error.message})
        }
    }
    
    

//UPDATE MOVIE ACTS AND SCENE
module.exports.screenplay = async (req, res) => {
        try{
            const sceneDetails = {
                SceneTitle:req.body.SceneTitle,
                Description:req.body.Description,
                actors : req.body.actors
            }
            await Movie.findByIdAndUpdate(
                { _id: req.body.movieId},
                {$set: {
                    "screenplay.$[e1].Scene.$[e2]": sceneDetails,
                },
            },{
                    arrayFilters: [{
                        "e1._id": req.body.actId,
                    },
                    {
                        "e2._id": req.body.sceneId,
                    }],
                    new: true   
                }).then((result)=>{
                    const update = result.screenplay.filter(act => act._id == req.body.actId);
                    return res.status(200).json({code:200,message:update})                                 
                    // const movie = await Movie.findById({_id:req.body.movieId});
                    // for (let i = 0; i < movie.screenplay.length; i++) 
                    // {   
                    //         if (movie.screenplay[i]._id == req.body.actId) 
                    //         {     
                    //                 return res.status(200).json({code:200,message:movie.screenplay[i]})
                    //             }
                    // }            
                }).catch((error)=>{
                    return res.status(404).json({code:404,message:error.message});
                })            
        }catch(error){
            return res.status(500).json({code:500,message:error.message})
        }
    }
    


//FOR UPDATE ACTOR IN THE SCENE
module.exports.updateactor = async (req,res)=>{
    try {
        const photopath = "http://localhost:8888/images/actor/" + req.file.filename;         
        const actordetails = {
            actorphoto : photopath,
            actorname : req.body.actorname,
            heroname : req.body.heroname,
            description : req.body.description 
        }
        await Movie.findByIdAndUpdate(
            {_id: req.body.movieId},
            {$set: {
                "screenplay.$[act].Scene.$[scene].actors.$[e3]":actordetails}
            },{
                arrayFilters:[{
                    "act._id":req.body.actId,
                },{
                    "scene._id":req.body.sceneId,
                },{
                    "e3._id":req.body.actorId
                }],
                new:true
            }).then((result)=>{                
                const update = result.screenplay.filter(act => act._id == req.body.actId);
                return res.status(200).json({update,message:"Actor Update Successfully"})
            }).catch((error)=>{
                return res.status(404).json({message:error.message});
            })
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//DELETE ACTOR IN THE SCENE
module.exports.removeactor = async(req,res)=>{
    try {
        await Movie.findByIdAndUpdate(
            {_id:req.body.movieId},
            {$pull:
                {"screenplay.$[act].Scene.$[scene].actors":{_id: req.body.actorId}}
            },{
                arrayFilters:[{
                    "act._id":req.body.actId,
                },{
                    "scene._id":req.body.sceneId
                }],
                new:true
            }).then((result)=>{
                const update = result.screenplay.filter(act => act._id == req.body.actId)
                return res.status(200).json({code:200,message:update});
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message});
            })
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}



//GET SPECIFIC USER MOVIE
module.exports.filter = async(req,res)=>{
    try {
        //console.log(req.user._id);        
        await Movie.find({author:req.user._id})
        .then((result)=>{
            return res.status(200).json({code:200,message:result})
        }).catch((err)=>{
            return res.status(404).json({code:404,message:err.message})
        })
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}



//GET MOVIE DATA
module.exports.movie = async(req,res)=>{
        try{
            const movie = await Movie.findById({_id: req.body.movieId})
            .populate({path:'author',select:['username','image']});
            if(!movie){
                return res.status(404).json({code:404,message:"Movie is not found"})    }
                return res.status(200).json({code:200,data:movie})
            }catch(error){
                return res.status(500).json({code:500,message:error.message});
            }
        }








//FOR FIND PARTICULER SCENE
    // const movie = await Movie.findById({ _id: req.body.movieId });
    //     for (let i = 0; i < movie.screenplay.length; i++) {
    //         if (movie.screenplay[i]._id == req.body.actId) {
    //             for (let j = 0; j < movie.screenplay[i].Scene.length; j++) {
    //                 if (movie.screenplay[i].Scene[j]._id == req.body.sceneId) {
    //                     console.log(movie.screenplay[i].Scene[j], "😊😊");
    //                     return res.json({ message: movie.screenplay[i].Scene[j] });
    //                 }
    //             }
    //         }
    //     }
