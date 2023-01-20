// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const fd = new FormData()
  fd.append("text.txt","abc")
  console.log(fd.getHeaders())

  res.status(200).json({ name: 'John Doe' })
}
