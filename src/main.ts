import { createApplication } from 'souljs';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.listen(8080);
}

main();
