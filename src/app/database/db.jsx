import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGO_URI
const user=process.env.MONGO_ATLAS_ID
const password=process.env.MONGO_ATLAS_PASSWORD
const atlas_uri=`mongodb+srv://${user}:${password}@cluster0.3m4yenq.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function connectDB() {
  try {
    await client.connect();
    
    const database = client.db('TypingMaster');
    const users = database.collection('Users');
    const passage=database.collection('Passage');
    const leaderboard=database.collection('Leaderboard');

    return {users,passage,leaderboard};
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

export default connectDB;