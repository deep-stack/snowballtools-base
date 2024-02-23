export const formatAddress = (address: string) => {
  if (address.startsWith('0x') && address.length > 10) {
    return address.slice(0, 6) + '..' + address.slice(-4);
  }

  return address;
};
