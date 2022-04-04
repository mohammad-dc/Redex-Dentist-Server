import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const result = await bcrypt.hash(password, 10);
    return result;
  } catch (error) {
    console.error("Hash Password Error: ", error);
  }
};

export const comparePassword = async (
  password: string,
  hash_password: string
) => {
  try {
    const result = await bcrypt.compare(password, hash_password);
    return result;
  } catch (error) {
    console.error("Compare Password Error: ", error);
  }
};
