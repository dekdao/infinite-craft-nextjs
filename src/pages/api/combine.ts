import { ElementModel } from "@/interfaces/element";
import connectDb from "@/libs/connect-db";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const w1 = req.query.word1 as string;
  const w2 = req.query.word2 as string;

  if (!w1 || !w2) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  await connectDb();

  const word1 = (w1 > w2 ? w1 : w2).toLowerCase();
  const word2 = (w1 > w2 ? w2 : w1).toLowerCase();
  
  const existingElement = await ElementModel.findOne({ word1, word2 });
  if (existingElement) {
    res.status(200).json(existingElement);
    return;
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Give me the word and emoji that represents the combination of ${word1} and ${word2}. ONLY answer in the following JSON format. { "emoji": [emoji represent the text], "text": [text in the same language as the 2 words] }`,
      },
      { role: "user", content: `${word1} + ${word2} =` },
    ],
    model: "gpt-4-turbo-preview",
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  const output = chatCompletion["choices"][0]["message"]["content"];
  if (!output) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  const jsonOutput = JSON.parse(output);

  const newElement = new ElementModel({
    word1,
    word2,
    emoji: jsonOutput.emoji,
    text: jsonOutput.text,
  });
  await newElement.save();

  res.status(200).json(newElement);
}
