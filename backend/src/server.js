import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PORT);

import app from "./app.js";


const PORT = process.env.PORT || 5000;

// Connect Database


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});