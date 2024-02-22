export const formatAddress = (address: string) => {
  if (address.startsWith('0x') && address.length > 8) {
    return address.slice(0, 4) + '..' + address.slice(-4);
  }

  return address;
};
