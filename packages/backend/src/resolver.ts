const user = {
  id: 2
};

export const createResolvers = async (): Promise<any> => {
  return {
    Query: {
      // TODO: fetch user data from db
      getUser: () => user
    }
  };
};
