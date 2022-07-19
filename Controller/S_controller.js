const { json } = require('body-parser');
const { Model } = require('mongoose');
const { findByIdAndUpdate, findById } = require('../Model/Seriesmodel');
const Series = require('../Model/Seriesmodel');
const { actor } = require('./M_controller');


//CREATE A NEW SERIES
module.exports.seriesdata = async(req,res)=>{
    try {        
            const {title,logline,tagline,synopsis,actor,tags,genres,similar} = req.body;                 
            const logLine = JSON.parse(logline);
            const Actor = JSON.parse(actor);
            const Tags = JSON.parse(tags);
            const Genres = JSON.parse(genres);
            const Similar = JSON.parse(similar);
        const series = await Series.findOne({title:req.body.title})
        if(series){
            return res.status(404).json({code:404,message:"Series is already exists"})
        }
        //FOR ADD THE SCREENPLAY IN THE SERIES
        
        //  let season = [];
        //  let episode = [];
        // // let act = [];
        // let scene = [];
        //  for(let i=1;i<=1;i++){
        //      season.push({
        //          SeasonName:`Season${i}`,
        //          Episodes: episode
        //      })
        //     for(let j=1;j<=10;j++){
        //         episode.push({
        //             EpName:`Episode${j}`,
        //             Act:act
        //         })
        //         for(let k=1;k<=4;k++){
        //             act.push({
        //                 ActName:`Act${k}`,
        //                 Scene:scene
        //             })
        //             for(let p=1;p<=10;p++){
        //                 scene.push({
        //                     SceneTitle:`Scene${p}`,
        //                     Actors:[]
        //                 })
        //             }
        //             scene = [];
        //         }
        //         act = [];
        //     }
        //     episode = [];
        // }
        //screenplayObj = Object.assign(season);

        //STORE MULTIPLE IMAGE IN MONGODB
        const element = [];
        for (let i = 0; i < req.files.length; i++) {
            element.push("http://localhost:8888/images/seriesbanner/" +req.files[i].filename);        
        }
        const newseries = await new Series({        
            title : title,
            files: element,
            logline:{
                incident :logLine.incident,
                protagonist : logLine.protagonist,
                action : logLine.action,
                antagonist : logLine.antagonist,    
            },
            tagline : tagline,  
            synopsis : synopsis,
            author: req.user._id,        
            actor : Actor,
            tags : Tags,
            genres : Genres,
            similar:Similar,
            // screenplay : screenplayObj  
        });
        newseries.save().then((result)=>{ 
            return res.status(200).json({code:200,result,message:"Series is created successfully"});
        }).catch((err)=>{
            return res.status(500).json({message:err.message});
        })              
    } catch (error) {
        console.log(error);
        return res.status(500).json({code:500,error : error.message});
    }   
}




//UPDATE THE SERIES
module.exports.updateseries = async (req,res)=>{
    try {
        const{title,logline,synopsis,tagline,tags,genres,actor  } = req.body;
        const series = await Series.findById({_id:req.body.seriesId})        
        const Logline = JSON.parse(logline);
        const Tags = JSON.parse(tags);
        const Actor = JSON.parse(actor);
        const Genres = JSON.parse(genres);
        const element = [];
        for (let i = 0; i < req.files.length; i++) {
            element.push("http://localhost:8888/images/seriesbanner/" +req.files[i].filename);        
        }
        console.log(series.title);
        if(series.title == req.body.title){
            await Series.findByIdAndUpdate(
                {_id:req.body.seriesId},
                {$set:{
                    files:element,
                    title:title,
                    logline :{
                        incident :Logline.incident,
                        protagonist :Logline.protagonist,
                        action :Logline.action,
                        antagonist :Logline.antagonist, 
                    },
                    tagline:tagline,
                    synopsis:synopsis,
                    tags:Tags,
                    actor:Actor,
                    genres:Genres                
                }},{safe:true}
            ).then(async(result)=>{
                return res.status(200).json({code:200,message:"Series Update Successfully",result})
            }).catch((error)=>{
                return res.status(404).json({message:error})
            })
        }else{
            const find = await Series.findOne({title:req.body.title})
            if(find){
                return res.status(409).json({code:409,message:"This Series Name Is Already Exists"});
            }
            await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$set:{
                files:element,
                title:title,
                logline :{
                    incident :Logline.incident,
                    protagonist :Logline.protagonist,
                    action :Logline.action,
                    antagonist :Logline.antagonist, 
                },
                tagline:tagline,
                synopsis:synopsis,
                tags:Tags,
                actor:Actor,
                genres:Genres                
            }},{safe:true}
        ).then(async(result)=>{
            return res.status(200).json({code:200,message:"Series Update Successfully",result})
        }).catch((error)=>{
            return res.status(404).json({message:error})
        })
        }
        
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}



//ADD NEW SEASON IN THE SERIES
module.exports.newseason = async (req,res)=>{
    try {
        const series = await Series.findById({_id: req.body.seriesId});
        if(!this.series){
            return res.status(404).json({code:404,message:"Series is not found"});
        }
        let Stitle = req.body.SeasonName;
        // ADD NEW ACT WITH BYDEFAULT SCENE AND DESCRIPTION
        let screenplayObj = {};
        let season = [];
        let episode = [];
        let act = [];
        let scene = [];
        for(let i=1;i<=1;i++){
            season.push({
                SeasonName:Stitle,
                Episodes: episode
            })
            // for(let j=1;j<=10;j++){
            //     episode.push({
            //         EpName:`Episode${j}`,
            //         Act:act
            //     })
            //     for(let k=1;k<=4;k++){
            //         act.push({
            //             ActName:`Act${k}`,
            //             Scene:scene
            //         })
            //         for(let p=1;p<=10;p++){
            //             scene.push({
            //                 SceneTitle:`Scene${p}`,
            //                 Actors:[]
            //             })
            //         }
            //         scene = [];
            //     }
            //     act = [];
            // }
            // episode = [];
        }
        screenplayObj = Object.assign(season);        
        await Series.findOneAndUpdate(
            {_id:req.body.seriesId},
                 {$push:{screenplay : screenplayObj}},
             {safe:true})
             .then((result)=>{
                 return res.status(200).json({code:200,message:result.screenplay});
             }).catch((error)=>{
                 return res.status(404).json({code:404,message:error});
                })   
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }   
}



//DELETE THE SEASON IN THE SERIES
module.exports.deleteSeason = async (req,res)=>{
    try {
        await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$pull:{screenplay :{_id:req.body.seasonId}}},{new:true,multi:false})
            .then((result)=>{
                return res.status(200).json({code:200,message:result.screenplay})
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message})
            })
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//ADD NEW EPISODE IN SEASON
module.exports.newepisode = async (req,res)=>{
    try {
        const series = await Series.findById({_id:req.body.seriesId})
        if(!series)
        {
            return res.status(404).json({code:404,message:"Series Is Not Found"});
        }
        let Etitle = req.body.EpisodeTitle;
        // const NewEP = series.screenplay.filter(season => season._id == req.body.seasonId);
        // const Epno = NewEP[0].Episodes.length;
        let seasonObj = {};
        let episode = [];
        let act = [];
        let scene = [];        
            for(let j=1;j<=1;j++){  
                episode.push({
                    EpisodeTitle:Etitle,
                    Act:act
                })
                for(let k=1;k<=4;k++){
                    act.push({
                        ActName:`Act${k}`,
                        Scene:scene
                    })
                    for(let p=1;p<=10;p++){
                        scene.push({
                            SceneTitle:`Scene${p}`,
                            Actors:[]
                        })
                    }
                    scene = [];
                }
                act = [];
            }
            seasonObj = Object.assign(episode);                           
        await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$push:{
                "screenplay.$[e1].Episodes": seasonObj }
            },{
                arrayFilters:[{
                    "e1._id":req.body.seasonId
                }],
                new:true
            }).then((result)=>{
                const newEP = result.screenplay.filter(season => season._id == req.body.seasonId)
                return res.status(200).json({code:200,message: newEP});
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message})
            })        
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//UPDATE THE SCENE OF SCREENPLAY
module.exports.screenplay = async (req,res)=>{
    try {
        const sceneDetails = {
            SceneTitle:req.body.SceneTitle,
            Description:req.body.Description,
            Actors: req.body.Actors
        }
        await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$set:{
                "screenplay.$[season].Episodes.$[episode].Act.$[act].Scene.$[scene]": sceneDetails }
            },{
                arrayFilters:[{
                    "season._id":req.body.seasonId
                },{
                    "episode._id":req.body.episodeId
                },{
                    "act._id":req.body.actId
                },{
                    "scene._id":req.body.sceneId
                }],
                new:true
            }).then((result)=>{
                const update = result.screenplay.filter(season => season._id == req.body.seasonId)
                return res.status(200).json({code:200,message:update});                
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message});
            })
        }catch(error){
            return res.status(500).json({code:500,message:error.message})
    }
}









//UPDATE ACTOR IN THE SCENE
module.exports.updateactor = async(req,res)=>{
    try {
        const imagepath = "http://localhost:8888/images/seriesbanner/" + req.file.filename;
        const actorDetails = {
            actorphoto: imagepath,
            actorname: req.body.actorname,
            heroname: req.body.heroname,
            description: req.body.description,
        };
        await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$set:{
                "screenplay.$[season].Episodes.$[episode].Act.$[act].Scene.$[scene].Actors.$[actor]": actorDetails}
            },{
                arrayFilters:[{
                    "season._id":req.body.seasonId
                },{
                    "episode._id":req.body.episodeId
                },{
                    "act._id":req.body.actId
                },{
                    "scene._id":req.body.sceneId
                },{
                    "actor._id":req.body.actorId
                }],
                new:true
            }).then((result)=>{                
                const newEP = result.screenplay.filter(season => season._id == req.body.seasonId)
                //console.log(newEP[0].Episodes[0].Act[0].Scene[0].Actors);
                return res.status(200).json({code:200,message:"Actor Update Successfully in Scene",newEP});
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message});
            })
    } catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//DELETE THE ACTOR IN SCENE
module.exports.removeactor = async (req,res)=>{
    try {
        await Series.findByIdAndUpdate(
            {_id:req.body.seriesId},
            {$pull:{
                "screenplay.$[season].Episodes.$[episode].Act.$[act].Scene.$[scene].Actors":{_id: req.body.actorId}}
            },{
                arrayFilters:[{
                    "season._id":req.body.seasonId
                },{
                    "episode._id":req.body.episodeId
                },{
                    "act._id":req.body.actId
                },{
                    "scene._id":req.body.sceneId
                }],
                new:true
            }).then((result)=>{
                const update = result.screenplay.filter(season => season._id == req.body.seasonId);
                return res.status(200).json({code:200,message:"Actor delete successfully",update});
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message});
            })
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }
}







//CREATE NEW ACTOR
module.exports.actor = async(req,res)=>{
    try {
        const {actorname,heroname,description} = req.body;
        const photopath = "http://localhost:8888/images/seriesbanner/" + req.file.filename;                
        Actor = {
            actorphoto : photopath,
            actorname,
            heroname,
            description
        }               
        return res.status(200).json({code:200,data:Actor})
    } catch (error) {
        return res.status(500).json({code:500,error : error.message});        
    }
}



//REMOVE ACTOR IN SERIES
module.exports.deleteactor = async(req,res)=>{
    try {                           
        await Series.findByIdAndUpdate(
            {_id : req.body.seriesId},
            { $pull: { actor: {_id: req.body.actorId}}},{ safe: true, multi: false })           
            .then((result)=>{        
                return res.status(200).json({code:200,message:"Actor delete Successfully in the series"})
            }).catch((err)=>{
                return res.status(500).json({message:err.message});
              })              
            } catch (error) {
                return res.status(500).json({code:500,message:error.message});
            }
        }
        
        
        
        
//GET FILTER OF SERIES
module.exports.filter = async(req,res)=>{
    try {        
        await Series.find({author:req.user._id})
        .then((result)=>{
            return res.status(200).json({code:200,message:result});
        }).catch((err)=>{
            return res.status(404).json({message:error})
        })
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//GET SERIES
module.exports.series = async(req,res)=>{
    try{
    const series = await Series.findById({_id: req.body.seriesId})
    .populate({path:'author',select:['username','image']});
    if(!series){
        return res.status(404).json({code:404,message:"Series is not found"})}
        return res.status(200).json({code:200,data:series})
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }
}
