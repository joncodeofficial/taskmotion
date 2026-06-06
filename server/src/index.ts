import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { userApp } from './routes/users';
import { listApp } from './routes/lists';
import { taskApp } from './routes/tasks';
import { aiApp } from './routes/ai';
import { notificationsApp } from './routes/notifications';
import { activityApp } from './routes/activity';

const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://taskmotion.pages.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.route('/lists', listApp);
app.route('/tasks', taskApp);
app.route('/users', userApp);
app.route('/ai', aiApp);
app.route('/notifications', notificationsApp);
app.route('/activity', activityApp);

export default app;
