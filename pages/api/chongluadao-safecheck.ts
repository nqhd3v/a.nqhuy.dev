// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { tApiError } from '../../utils/types/api';

type Data = {
  name: string
}

const CHONGLUADAO_SAFECHECK_API = 'https://api.chongluadao.vn/v1/safecheck';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ isSafe: boolean } | tApiError>
) {
  if (req.method === "POST") {
    try {
      const { url } = req.body;
      if (!url) {
        throw new Error('Unknown URL');
      }
      const data = await axios.post(CHONGLUADAO_SAFECHECK_API, { url })
      res.status(200).json({ isSafe: data.data.type !== "unsafe" });
    } catch (err: any) {
      res.status(400).json({
        isError: true,
        errorData: err.message,
      });
    }
  } else {
    res.status(404).json({
      isError: true,
      errorData: 'API not exist to handle your request!'
    });
  }
}
