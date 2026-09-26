import { backendApp } from '../src/server/app';

export default function handler(req: any, res: any) {
  return backendApp(req, res);
}
