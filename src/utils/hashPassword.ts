import { compareSync, genSaltSync, hashSync } from "bcrypt";
const hash = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};
const comparePassword = (password: string, hashedPassword: string): boolean => {
  return compareSync(password, hashedPassword);
};

export { hash, comparePassword };
