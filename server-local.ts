// server-localStorage.ts
import app from "./server/api/index.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Local API on port ${PORT}`));
