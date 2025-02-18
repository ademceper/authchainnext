import { NextApiRequest, NextApiResponse } from 'next';
import { RealmController } from '@/modules/realm/realm.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return RealmController.getAll(req, res);
    case 'POST':
      return RealmController.create(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}