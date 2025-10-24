const fs = require("fs");
const filePath = "./tasks.json";

// get command and argument
const command = process.argv[2];
const arg = process.argv[3];

// 🔹 Load tasks safely
const loadTask = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    const parsedData = JSON.parse(dataJSON);
    if (!Array.isArray(parsedData)) return [];
    return parsedData;
  } catch (error) {
    // if file missing or invalid JSON → return empty array
    return [];
  }
};

// 🔹 Save tasks safely
const saveTask = (tasks) => {
  try {
    const strTask = JSON.stringify(tasks);
    fs.writeFileSync(filePath, strTask);
  } catch (error) {
    console.error("❌ Error saving tasks:", error.message);
  }
};

// 🔹 Display tasks
const displayTasks = () => {
  const data = loadTask();

  if (data.length === 0) {
    console.log("📭 No tasks found!");
    return;
  }

  console.log("\n📝 Your Tasks:");
  data.forEach((task, i) => {
    console.log(`${i + 1}. ${task.task}`);
  });
  console.log();
};

// 🔹 Add task
const addTask = (task) => {
  if (!task || task.trim() === "") {
    console.log("⚠️ Please provide a valid task description.");
    return;
  }

  const data = loadTask();
  data.push({ task: task.trim() });
  saveTask(data);
  console.log(`✅ Task added: "${task.trim()}"`);
};

// 🔹 Remove task
const removeTask = (arg) => {
  const index = Number.parseInt(arg);

  if (isNaN(index)) {
    console.log("⚠️ Please provide a valid numeric index.");
    return;
  }

  const data = loadTask();

  if (data.length === 0) {
    console.log("📭 No tasks to remove.");
    return;
  }

  if (index < 1 || index > data.length) {
    console.log("❌ Invalid index. Please check task list.");
    return;
  }

  const removed = data.splice(index - 1, 1);
  saveTask(data);
  console.log(`🗑️ Removed task: "${removed[0].task}"`);
};

// 🔹 Command Handling
switch (command) {
  case "add":
    addTask(arg);
    break;

  case "list":
    displayTasks();
    break;

  case "remove":
    removeTask(arg);
    break;

  default:
    console.log(`
⚙️  Usage:
  node todo.js add "Task Name"   ➜ Add a new task
  node todo.js list              ➜ Show all tasks
  node todo.js remove 2          ➜ Remove task #2
`);
}
