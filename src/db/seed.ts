import { db } from "@/db/index";
import { todos } from "@/db/schema";

// Run this script with the following command:
// docker exec -it <container_name_or_id> npm run seed

async function seed() {
  console.log("Seeding database...");

  try {
    const existingTodos = await db.select().from(todos).limit(1);

    if (existingTodos.length > 0) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    await db.insert(todos).values([
      {
        title: "Buy groceries",
        description: "Milk, bread, eggs",
        completed: false,
      },
      {
        title: "Walk the dog",
        description: "Take the dog to the park",
        completed: true,
      },
      {
        title: "Finish project",
        description: "Complete the Node.js API with Drizzle",
        completed: false,
      },
      {
        title: "Learn Drizzle ORM",
        description: "Explore advanced Drizzle features",
        completed: false,
      },
      {
        title: "Set up Docker",
        description: "Containerize the application",
        completed: true,
      },
      {
        title: "Deploy to production",
        description: "Deploy the application to a cloud provider",
        completed: false,
      },
    ]);

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();