export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = () => {
  const hasher = new Bun.CryptoHasher("sha256");

  hasher.update(Math.random().toString(36).substring(2));

  return hasher.digest("hex");
};

export const generatePasswordHash = async (password: string) => {
  const hash = await Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 2 ** 16,
    timeCost: 3,
  });

  return hash;
};
