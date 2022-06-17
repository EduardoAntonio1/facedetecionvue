import multer from 'multer'
import Img from '../models/img'

const generateId = () => Math.random().toString(36).substr(2, 18);

const imgUrl = async (filename,name) => {
    const imgUrl = `http://localhost:3000/public/${filename}`
    console.log(imgUrl);

    const newImg = new Img({
        name,
        imgUrl
    })
    await newImg.save();
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'src/uploads');
    },
    filename:(req,file,cb)=>{
        const ext = file.originalname.split('.').pop()
        const filename = `${generateId()}.${ext}`;
        cb(null,filename);
        imgUrl(filename,req.body.name);
    }
})

export const upload = multer ({storage})
