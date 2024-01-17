import { Database } from './database';

export const createResolvers = async (db: Database): Promise<any> => {
  return {
    Query: {
      user: (
        _: any,
        __: any,
        // TODO: add custom type for context
        context: any
      ) => {
        return db.getUser(context.userId);
      },
      organizations: (_:any, __: any, context: any) => {
        return db.getOrganizations(context.userId);
      }
    }
  };
};
