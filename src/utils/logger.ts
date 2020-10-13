export const log = (message: string, error?: Error) => {
  let logMessage = `[${new Date().toLocaleString()}] ${message}`;
  if (error) logMessage += `\n${error.toString()}`;
  logMessage += '\n\n';

  process.stdout.write(logMessage);
};
