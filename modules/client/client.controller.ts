import { ClientService } from './client.service';
import { NextApiRequest, NextApiResponse } from 'next';

export class ClientController {
  
  static async getAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const realms = await ClientService.getAllClients();
      return res.status(200).json({ success: true, data: realms });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }

  static async getById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      const realm = await ClientService.getClientById(id as string);
      return res.status(200).json({ success: true, data: realm });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(error.message === 'Realm not found' ? 404 : 400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }

  static async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const result = await ClientService.createClient(req.body);
      return res.status(201).json(result); 
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }

  static async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const result = await ClientService.updateClient(req.body);
      return res.status(200).json(result); 
    } catch (error) {
      if (error instanceof Error) {
        return res.status(error.message === 'Realm not found' ? 404 : 400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }

  static async delete(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      const result = await ClientService.deleteClient(id as string);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(error.message === 'Realm not found' ? 404 : 400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }
}
