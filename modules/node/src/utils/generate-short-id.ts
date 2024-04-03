import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({length: 6});

export const generateShortId = () => {
  return uid.rnd();
};
