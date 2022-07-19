const Book = require('../Model/Bookmodel')



//ADD NEW BOOK
module.exports.bookdata = async(req,res)=>{
    try {        
        const {title,logline,tagline,synopsis,writer,tags,genres,similar} = req.body;              
        const logLine = JSON.parse(logline);
        const Writer = JSON.parse(writer);
        const Tags = JSON.parse(tags);
        const Genres = JSON.parse(genres);
        const Similar = JSON.parse(similar);         

        const book = await Book.findOne({title:req.body.title})
        if(book){
            return res.status(404).json({code:404,message:"This Book Title Is Alredy Exists"})
        }

        // //ADD THE DEFULT DATA OF MANUSCRIPT IN bookDATA
        // let manuscriptobj = {};
        // let act = [];
        // let chapter = [];
        // for(let i=1;i<=5;i++){
        //     act.push({
        //         ActTitle:`Act${i}`,
        //         Chapter : chapter
        //     })
        //     for(let j=1;j<=10;j++){
        //         chapter.push({
        //             ChapterTitle:`Chapter${j}`,
        //             writer:[]
        //         })
        //     }
        //     chapter = [];
        // }
        // manuscriptobj = Object.assign(act);

        const imagepath = "http://localhost:8888/images/Bookphoto/" + req.file.filename;
        const newbook = await new Book({        
            title : title,
            bookphoto: imagepath,
            logline:{
                incident :logLine.incident,
                protagonist : logLine.protagonist,
                action : logLine.action,
                antagonist : logLine.antagonist,    
            },
            tagline : tagline,
            synopsis : synopsis,
            writer : Writer,
            author: req.user._id,
            tags : Tags,
            genres : Genres,
            similar: Similar,
            //manuscript : manuscriptobj
        });
        newbook.save().then((result)=>{               
            return res.status(200).json({code:200,message:"Book Is Created successfully",result});
        }).catch((err)=>{        
            return res.status(500).json({message:err.message});
        })              
    } catch (error) {
        return res.status(500).json({code:500,error : error.message});
    }   
}






//ADD NEW ACT IN BOOK
module.exports.newact = async (req,res)=>{
    try {
        const book = await Book.findById({_id: req.body.bookId});
        if(!book){
            return res.status(404).json({code:404,message:"Book is not found"});
        }
        const ActName = book.manuscript.length;
    // ADD NEW ACT WITH BYDEFAULT SCENE AND DESCRIPTION
        let manuscriptobj = {};
        let act = [];
        let chapter = [];
        for(let i = ActName + 1;i<= ActName + 1;i++){
            act.push({
                ActTitle:`Act${i}`,
                Chapter : chapter
            })
            for(let j=1;j<=10;j++){
                chapter.push({
                    ChapterTitle:`Chapter${j}`,
                    writer:[]
                })
            }
            chapter = [];
        }
        manuscriptobj = Object.assign(act);    
        await Book.findOneAndUpdate(
            {_id:req.body.bookId},
            {$push:{manuscript : manuscriptobj}},
            {safe:true})
            .then((result)=>{
                return res.status(200).json({code:200,message:result.manuscript});
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error});
            })   
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }   
}



//UPDATE BOOK DETAIS
module.exports.updatebook = async(req,res)=>{
    try{
        const {title,logline,tagline,synopsis,writer,tags,genres} = req.body;
        const book = await Book.findOne({_id:req.body.bookId})        
        const logLine = JSON.parse(logline);
        const Writer = JSON.parse(writer);
        const Tags = JSON.parse(tags);
        const Genres = JSON.parse(genres);               
        const imagepath = "http://localhost:8888/images/Bookphoto/" + req.file.filename;
        if(book.title == req.body.title){
        await Book.findOneAndUpdate(
            {_id : req.body.bookId},
            { $set: {
                bookphoto:imagepath,
                title:title,
                logline:{
                    incident :logLine.incident,
                    protagonist : logLine.protagonist,
                    action : logLine.action,
                    antagonist : logLine.antagonist,    
                },
                tagline : tagline,  
                synopsis : synopsis,        
                writer : Writer,
                tags : Tags,
                genres : Genres,               
            }},{ safe: true, multi: false })           
            .then((result)=>{        
                return res.status(200).json({code:200,result,message:"Book Update Successfully"})
            }).catch((err)=>{
                return res.status(500).json({message:err.message});
            })
        }else{
            const find = await Book.findOne({title:req.body.title})
            if(find){
                return res.status(409).json({code:409,message:"This Book Title Is Already Exists"});
            }
            await Book.findOneAndUpdate(
                {_id : req.body.bookId},
                { $set: {
                    bookphoto:imagepath,
                    title:title,
                    logline:{
                        incident :logLine.incident,
                        protagonist : logLine.protagonist,
                        action : logLine.action,
                        antagonist : logLine.antagonist,    
                    },
                    tagline : tagline,  
                    synopsis : synopsis,        
                    writer : Writer,
                    tags : Tags,
                    genres : Genres,               
                }},{ safe: true, multi: false })           
                .then((result)=>{        
                    return res.status(200).json({code:200,result,message:"Book Update Successfully"})
                }).catch((err)=>{
                    return res.status(500).json({message:err.message});
                })
        }            
    }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}



//FOR UPDATE MANUSCRIPT IN BOOK 
module.exports.manuscript = async (req,res)=>{
    try {
        const bookdetails = {
            ChapterTitle : req.body.ChapterTitle,
            Description : req.body.Description,
            writer : req.body.writer
        }
        await Book.findByIdAndUpdate(
            {_id: req.body.bookId},
            {$set: {
                "manuscript.$[act].Chapter.$[chap]":bookdetails
            }
        },{
                arrayFilters:[{
                    "act._id":req.body.actId,
                },{
                    "chap._id":req.body.chapterId
                }],
                new:true
            }).then((result)=>{                
                const update = result.manuscript.filter(act => act._id == req.body.actId);
                return res.status(200).json({update,message:"Manuscrpt update successfully"})
            }).catch((error)=>{
                return res.status(404).json({message:error.message});
            })
        }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }
}




//UPDATE ACTOR IN THE CHAPTER
module.exports.updatewriter = async (req,res)=>{
    try {        
        const writerdetails = {
            writername : req.body.writername,
            feature : req.body.feature           
        }
        await Book.findByIdAndUpdate(
            {_id: req.body.bookId},
            {$set: {
                "manuscript.$[act].Chapter.$[chap].writer.$[e3]":writerdetails}
            },{
                arrayFilters:[{
                    "act._id":req.body.actId,
                },{
                    "chap._id":req.body.chapterId,
                },{
                    "e3._id":req.body.writerId
                }],
                new:true
            }).then((result)=>{                
                const update = result.manuscript.filter(act => act._id == req.body.actId);
                return res.status(200).json({update,message:"Writer Update Successfully"})
            }).catch((error)=>{
                return res.status(404).json({message:error.message});
            })
        }catch(error){
        return res.status(500).json({code:500,message:error.message})
    }
}




//DELETE WRITER IN THE SCENE
module.exports.removewriter = async (req,res)=>{
    try {        
        await Book.findByIdAndUpdate(
            {_id: req.body.bookId},
            {$pull: {
                "manuscript.$[act].Chapter.$[chap].writer": {_id:req.body.writerId}}
            },{
                arrayFilters:[{
                    "act._id":req.body.actId,
                },{
                    "chap._id":req.body.chapterId,
                }],
                new:true
            }).then((result)=>{                
                const update = result.manuscript.filter(act => act._id == req.body.actId);
                return res.status(200).json({update,message:"Manuscrpt update successfully"})
            }).catch((error)=>{
                return res.status(404).json({message:error.message});
            })
        }catch(error){
            return res.status(500).json({code:500,message:error.message})
    }
}




//DELETE ACT IN MANUSCRIPT
module.exports.deleteact = async(req,res)=>{
    try{
        await Book.findByIdAndUpdate(
            {_id:req.body.bookId},
            {$pull:{manuscript :{_id:req.body.actId}}},
            {safe:true})
            .then(()=>{
                return res.status(200).json({message:"Act delete Successfully"})
            }).catch((error)=>{
                return res.status(404).json({message:error.message});
            })            
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }
}



//DELETE CHAPTER IN THE MANUSCRIPT
module.exports.deletechap = async(req,res)=>{
    try {        
        await Book.findByIdAndUpdate(
            { _id: req.body.bookId},
            {$pull: 
                {"manuscript.$[e1].Chapter": { _id: req.body.chapterId }}
            },{
                arrayFilters:[{
                    "e1._id":req.body.actId,
                }],
                new:true
            })
            .then(()=>{
                return res.status(200).json({code:200,message:"Chapter Delete Successfully"})
            }).catch((error)=>{
                return res.status(404).json({code:404,message:error.message})
            })
    } catch (error) {
        return res.status(500).json({code:500,message:error,message})
    }     
}




//CREATE NEW WRITER
module.exports.writer = async(req,res)=>{
    try {
        const {writername,feature} = req.body;
        writer = {
            writername,
            feature            
        }               
        return res.status(200).json({code:200,data:writer})
    } catch (error) {
        return res.status(500).json({code:500,error : error.message});        
    }
}




//DELETE WRITER IN BOOK                 
module.exports.deletewriter = async(req,res)=>{
    try {                    
        await Book.findByIdAndUpdate(
            {_id : req.body.bookId},
            { $pull: { writer: {_id: req.body.writerId}}},{ safe: true, multi: false })           
            .then((result)=>{        
                return res.status(200).json({code:200,message:"Writer is delete Successfully"})
              }).catch((err)=>{
                  return res.status(500).json({message:err.message});
                })              
            } catch (error) {
                return res.status(500).json({code:500,message:error.message});
            }
        }
    


//FILTER THE BOOK
module.exports.filter = async(req,res)=>{
    try {       
        await Book.find({author:req.user._id})
        .then((result)=>{
            return res.status(200).json({code:200,message:result})
        }).catch((error)=>{
            return res.status(404).json({error:message.error})
        })  
    } catch (error) {
        return res.status(500).json({code:500,message:error})
    }
}


        
        
//GET BOOK 
module.exports.book = async(req,res)=>{
    try{       
        const book = await Book.findById({_id: req.body.bookId})
        .populate({path:'author',select:['username']});
        if(!book){
            return res.status(404).json({code:404,message:"Book is not exists"})
        }
        return res.status(200).json({code:200,message:book})
    }catch(error){
        return res.status(500).json({code:500,message:error.message});
    }
}






