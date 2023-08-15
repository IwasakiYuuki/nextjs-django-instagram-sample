import express from 'express'
import accountRouter from './routes/accountRouter';

const app = express();

app.use(express.json())
app.use('', accountRouter);
app.get('/helloworld', (_, res) => {
  res.status(200).send({ message: 'hello, world' })
})

app.listen(8000)
