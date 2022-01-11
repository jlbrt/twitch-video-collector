export const log = (message: string, error?: Error) => {
  if (error) message += `\n${error.toString()}`;
  message += '\n\n';

  process.stdout.write(message);
};
