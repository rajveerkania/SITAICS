import mongoose from 'mongoose';

export function connect(): void {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error('MONGO_URL environment variable is not defined');
    return;
  }

  mongoose
    .connect(mongoUrl, {
      tls: true,
      ssl: true,
    })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('The DB error is', err));
}
