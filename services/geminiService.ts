
import { GoogleGenAI, Type } from "@google/genai";
import type { SquareValue } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will not throw in the user's browser, but helps in development environments
  // to remind that API_KEY is necessary.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    move: {
      type: Type.INTEGER,
      description: "The index of the square (0-8) for the next move.",
    },
  },
  required: ["move"],
};

export const getAiMove = async (board: SquareValue[]): Promise<number> => {
  const boardStateString = JSON.stringify(board.map(s => s || 'null'));

  const prompt = `
    You are an expert Tic Tac Toe player. Your role is to play as 'O'.
    The user, playing as 'X', has provided the current state of the board.
    The board is a 9-element array, where indices 0-8 correspond to the squares from top-left to bottom-right.
    'X' represents the user's move, 'O' represents your move, and 'null' represents an empty square.

    Your task is to determine the best possible move for 'O'.
    1.  If you can win, take the winning move.
    2.  If you cannot win, but the player 'X' can win on their next turn, block their winning move.
    3.  Otherwise, choose the strategically best available square.
    
    Your response must be a valid JSON object conforming to the specified schema.
    Only choose an empty square (a square with a 'null' value).

    Current board state:
    ${boardStateString}

    Analyze the board and return your optimal move.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    if (typeof result.move === 'number' && result.move >= 0 && result.move <= 8) {
      return result.move;
    } else {
      throw new Error("Invalid move received from AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get AI move from Gemini.");
  }
};
