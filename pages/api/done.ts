// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import tasks from "../../data/tasks.json"
import * as fs from 'fs'
import * as path from 'path'

export type Task = (typeof tasks)[0]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const savedTasks = tasks.map((task)=>{
    if (task.id === id) task.status = "済"
    return task
  })
  //雑にファイル上書き
  console.log('__dirname:',__dirname)
  fs.writeFileSync(path.resolve(__dirname, '../../../../data/tasks.json'),JSON.stringify(savedTasks))
  
  res.status(200).json('OK')
}
