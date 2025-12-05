// server-local.cjs
const app = require("../api/index.js").default;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Local API on port ${PORT}`));
