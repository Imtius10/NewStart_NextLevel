import express,{ Application, Request, Response, urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import globalError from "./middlewares/GlobalError/globalError";

const app: Application = express();


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5000/",
    credentials: true
}
)
);


app.use(urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
    res.send("Hello");
});


app.use("/api/auth",);

app.use(globalError);

export default app;