import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
    {
        nom:{
            type:String,
            required:true,
        },
        alias:{
            type:String,
            required:true,
        },
        univers:{
            type:String,
            required:true,
            enum: ['Marvel', 'DC', 'Autre'],
        },
        pouvoirs:{
            type:[String],
            required:true,
        },
        description:{
            type:String,
        },
        image:{
            type:String,
        },
        origine:{
            type:String,
        },
        premiereApparition:{
            type:Date,
        }
    }
);

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;