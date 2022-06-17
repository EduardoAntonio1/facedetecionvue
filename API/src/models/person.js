import {Schema, model} from 'mongoose'

const personSchema = new Schema({
    name:String,
    img:[{
        ref: "Image",
        type: Schema.Types.String
    }]
},
{
    timestamps:true,
    versionKey:false
});

export default model('Person',personSchema);