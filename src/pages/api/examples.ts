import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  // Remove
  const examples = await prisma.user.findMany();
  res.status(200).json(examples);
};

export default examples;
