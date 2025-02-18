import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '@/modules/client/client.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  switch (req.method) {
    case 'GET':
      return ClientController.getById(req, res);
    case 'PUT':
      return ClientController.update(req, res);
    case 'DELETE':
      return ClientController.delete(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}