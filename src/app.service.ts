import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async getData(): Promise<{ data: string }> {
    try {
      const response = await axios.get('http://localhost:3001');
      return { data: response.data.data || 'External service responded' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error(
        'Error fetching data from external service: ' + error.message,
      );
    }
  }
}
