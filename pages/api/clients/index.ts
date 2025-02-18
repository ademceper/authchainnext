import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '@/modules/client/client.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return ClientController.getAll(req, res);
    case 'POST':
      return ClientController.create(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}