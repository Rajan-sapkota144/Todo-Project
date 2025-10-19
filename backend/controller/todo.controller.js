import Todo from "../model/todo.model.js";


//Todo Create
export const createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed, // optional: can omit, default=false
    });

    const newTodo = await todo.save();
    res.status(201).json({
      message: "✅ Todo Created Successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error("❌ Error creating todo:", error.message);
    res.status(400).json({
      message: "Error occurred in todo creation",
    });
  }
};

//Todo Fetch
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(201).json({
      message: "Data Fatched", todos
    })
  }
  catch (error) {
    console.error("❌ Error creating todo:", error.message);
    res.status(400).json({
      message: "Error occurred in todo creation",
    });
  }
};


export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(201).json({
      message: "Todo Updated successfully",
      todo,
    });
  } catch (error) {
    console.error("❌ Error updating todo:", error.message);
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    res.status(400).json({
      message: "Error occurred in todo Updation",
    });
  }
};


export const deleteTodo=async (req,res)=>{
  try {
    const todo=await Todo.findByIdAndDelete(req.params.id);
    if(!todo){
      return res.status(401).json({message:"Todo not found"});
    }
    res.status(201).json({message:"Todo deleted successfully"})
  } catch (error) {
    console.error("❌ Error on Deleting:", error.message);
    res.status(400).json({
      message: "Error occurred in todo deletion",
    });
  }
}