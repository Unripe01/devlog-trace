// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import tasks from "../../data/tasks.json"

export type Task = (typeof tasks)[0]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task>
) {
  res.status(200).json(tasks)
}
