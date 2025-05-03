const express = require("express");
const multer = require("multer");
const cors = require("cors");
const cloudinary = require("./config/cloudinary");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 4000
require("dotenv").config();

app.use(express.json());
app.use(cors());

const upload = multer({
  dest: "uploads/",
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // console.log(req.file)
    //  const file = req.files[0];
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery-mern",
    });
    fs.unlinkSync(req.file.path);
    res.json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", message: error.message });
  }
});

app.get("/images", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:gallery-mern")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

      const imageurls = result.resources.map(img => img.secure_url)
      res.json(imageurls)
  } catch (error) {
        res.status(500).json({ error: "Fetching images failed", message: error.message });

  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
