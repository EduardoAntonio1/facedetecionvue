import {Schema, model} from 'mongoose'

const imgSchema = new Schema(
    {
    name:String,
    imgUrl:String
    },
    {
    versionKey:false
    }
);

export default model("Image", imgSchema);