const { getClient } = require("./config/get-client");

// Define a User type if not defined yet
type User = {
  id: number;
  username: string;
  password: string;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const client = await getClient();

  const response = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  client.end();

  console.log(response.rows[0])
  return response.rows[0] || null; // Return the user object or null if not found
};

export const getUserById = async (id: string): Promise<User | null> => {
    const client = await getClient();
  
    const response = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    client.end();
  
    return response.rows[0] || null; // Return the user object or null if not found
  };