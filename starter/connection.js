module.exports = async mongoose => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    err => console.log(`Error: ${err.message}`);
  }
};
