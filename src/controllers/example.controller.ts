import { Request, Response } from "express";
import * as ExampleService from "../services/example.service";

export async function example(req: Request, res: Response) {
  try {
    const example = await ExampleService.helloWorld();
    res.status(201).json(example);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
