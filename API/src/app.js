import express from 'express'
import morgan from 'morgan'
import pkg from '../package.json'

import {createRoles} from './libs/initialSetup'
import authRoutes from './routes/auth.routes'
import personsRoutes from './routes/person.routes'
import userRoutes from './routes/user.routes'


const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
createRoles();

app.set('pkg',pkg)
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
      name:app.get('pkg').name,
      author:app.get('pkg').author,
      description:app.get('pkg').description,
      version:app.get('pkg').version
  })
})


app.use('/public',express.static(`${__dirname}/uploads`))
app.use('/api/auth',authRoutes);
app.use('/api/person',personsRoutes);
app.use('/api/users',userRoutes);



export default app;