export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateVerificationToken = () => {
  const hasher = new Bun.CryptoHasher("sha256");

  hasher.update(Math.random().toString(36).substring(2));

  return hasher.digest("hex");
};
