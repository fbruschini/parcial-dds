const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API DDS escuchando en http://localhost:${PORT}`);
});
