const User = {
  id: 2
};

export const createResolvers = async (): Promise<any> => {
  return {
    Query: {
      getUser: () => User
    }
  };
};
