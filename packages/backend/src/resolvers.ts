const user = {
  id: 1
};

export const createResolvers = async (): Promise<any> => {
  return {
    Query: {
      // TODO: fetch user data from db
      user: () => user
    }
  };
};
