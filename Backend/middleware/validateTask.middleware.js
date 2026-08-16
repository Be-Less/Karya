const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || typeof title !== "string" || title.trim() == "") {
    return res.status(400).json({
      message: "Title is required and must be a non empty string.",
    });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  next();
};
export default validateTask;
