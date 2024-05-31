import { z } from 'zod';

export const validateEnvironmentVars = async () => {
  const schema = z.object({
    DBHOST: z.string(),
    DBPORT: z.coerce.number().int(),
    DBUSER: z.string(),
    DBPASSWORD: z.string(),
    DBNAME: z.string(),
    TARGETTWITCHCHANNEL: z.string(),

    YOUTUBEAUTHTOKEN: z.string(),
  });

  schema.parse(process.env);
};
