import { Element, ElementModel } from "@/interfaces/element";
import connectDb from "@/libs/connect-db";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// for openai
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// for togetherai
// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY,
//   baseURL: "https://api.together.xyz/v1",
// });

type ResponseData = {
  message: string;
  element?: Element;
  discovered?: boolean;
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
    return res.status(200).json({
      message: "element already exists",
      element: {
        emoji: existingElement.emoji,
        text: existingElement.text,
        discovered: false,
      },
    });
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Give me the word and emoji that represents the combination or something in between of "${word1}" and "${word2}".

        ONLY answer in the following JSON format. 
        
        { "emoji": [emoji that best represent the text], "text": [text in the same language as the 2 words] }`,
      },
      { role: "user", content: `${word1} + ${word2} =` },
    ],
    // model: "gpt-3.5-turbo",
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

  const existingElement2 = await ElementModel.findOne({
    text: jsonOutput.text.toLowerCase(),
  });
  
  if (existingElement2) {
    jsonOutput.emoji = existingElement2.emoji;
  }

  const newElement = new ElementModel({
    word1,
    word2,
    emoji: jsonOutput.emoji,
    text: jsonOutput.text.toLowerCase(),
  });
  await newElement.save();

  return res.status(200).json({
    message: "new element created",
    element: {
      emoji: jsonOutput.emoji,
      text: jsonOutput.text,
      discovered: true,
    },
  });
}
