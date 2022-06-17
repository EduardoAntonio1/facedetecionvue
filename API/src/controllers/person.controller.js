import Person from '../models/person'
import Img from '../models/img'

export const insertPerson = async (req,res) =>{

    const {name,img} = req.body;
    const newPerson = new Person({
        name
    });

    const foundImg = await Img.find({name:{$in:name}});
    newPerson.img = foundImg.map(img => img.imgUrl);

    const personSave = await newPerson.save();

    res.json(personSave);
}

export const getPerson = async (req,res) =>{

    const people =  await Person.find();
    res.json(people);
}

export const getPersonById = async (req,res) =>{
    const person = await Person.findById(req.params.personId);
    res.json(person);
}

export const updatePersonById = async (req,res) =>{
    const updatePerson = await Person.findByIdAndUpdate(req.params.personId, req.body,{
        new: true
    });
    res.json(updatePerson);
}

export const deletePersonById = async (req,res) =>{
    const deletePerson = await Person.findByIdAndDelete(req.params.personId);
    res.status(204).json();
}