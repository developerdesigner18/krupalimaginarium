const mongoose = require("mongoose");

const moviedata = mongoose.Schema({
  moviebanner: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  logline: {
    incident: {
      type: String,
    },
    protagonist: {
      type: String,
    },
    action: {
      type: String,
    },
    antagonist: {
      type: String,
    },
  },
  tagline: {
    type: String,
    require: true,
  },
  synopsis: {
    type: String,
    require: true,
  },
  actor: [
    {
      actorphoto: String,
      actorname: String,
      heroname: String,
      description: String,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userdata",
    require: true,
  },
  tags: [String],
  genres: [],
  similar: [
    {
      movieId: String,
      moviebanner: String,
      title: String,
      synopsis: String,
    },
  ],
  screenplay: [{
      ActTitle: String,     
        Scene: [{
          SceneTitle: {type: String, default: 'Please Enter Scene Title'},
          Description: {type: String, default: 'Please Enter Scene Description'},
          actors: [{
            actorphoto: String,
            actorname: String,
            heroname: String,
            description: String,
          }]
        }]
      }],
});

module.exports = mongoose.model("Movie", moviedata);




/*


*/