const validateTaskUpdate = (req, res, next) => {
  const { title, description, status } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required to update",
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Title must be a non- empty string",
      });
    }
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Description must be a non- empty string",
    });
  }

  const validStatuses = ["todo", "in-progress", "completed"];

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  next();
};

export default validateTaskUpdate;
