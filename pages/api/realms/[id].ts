import { NextApiRequest, NextApiResponse } from 'next';
import { RealmController } from '@/modules/realm/realm.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  switch (req.method) {
    case 'GET':
      return RealmController.getById(req, res);
    case 'PUT':
      return RealmController.update(req, res);
    case 'DELETE':
      return RealmController.delete(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}