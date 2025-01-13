import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { promptToGemini } from "./llm/testgemini";
import {Gemini} from "~/llm/model/gemini";
import {VPDL} from "~/vpdl/vpdl";
import {MyOpenAI} from "~/llm/model/myopenai";

dotevnv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.listen(PORT, () => {
  console.log(`Server is listening on port {PORT}`);
});

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET"],
}));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/vpdl", async (req, res) => {
  const { userViewPath, ecoreFiles } = req.body;
  const gemini = new Gemini();
  const vpdl = new VPDL(gemini);
  const result = await vpdl.runVPDL(userViewPath, ecoreFiles);

  res.send(result);
});

app.post("/vpdlOpenAI", async (req, res) => {
  const { userViewPath, ecoreFiles } = req.body;
  const openAI = new MyOpenAI();
  const vpdl = new VPDL(openAI);
  const result = await vpdl.runVPDL(userViewPath, ecoreFiles);
  res.send(result);
});

app.post("/generate/prompt", async (req, res) => {
  const prompt = req.body.prompt;
  const geminiResult = await promptToGemini(prompt, false);
  res.send(geminiResult);
});
