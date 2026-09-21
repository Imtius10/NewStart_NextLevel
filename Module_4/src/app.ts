import express, {
  Application,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import globalError from "./middlewares/GlobalError/globalError";
import { userRouter } from "./module/user/user.routes";
import { propertyRouter } from "./module/properties/properties.routes";
import { rentalRequestRouter } from "./module/rentalRequest/rentalrequest.routes";
import { landlordRouter } from './module/landlord/landlord.routes';
import { adminRouter } from "./module/admin/admin.routes";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use("/api/auth", userRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/rentals", rentalRequestRouter);

app.use(globalError);
app.use("/api/landlord", landlordRouter);
app.use("/api/admin", adminRouter);

export default app;