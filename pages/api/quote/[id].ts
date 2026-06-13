import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "quoteId puuttuu" });
  }

  const { data, error } = await supabase
    .from("request_quotes")
    .select("id, date, location, guests, email")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Tarjouspyyntöä ei löytynyt" });
  }

  return res.status(200).json(data);
}