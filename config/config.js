module.exports = {
    MONGO_IP : process.env.MONGO_IP || "mongo",
    MONGO_PORT : process.env.MONGO_PORT || "27017",
    // MONGO_DB_NAME : process.env.MONGO_DB_NAME || "test",
    MONGO_USER : process.env.MONGO_USER ,
    MONGO_PASSWORD : process.env.MONGO_PASSWORD,
    REDIS_URL:  process.env.REDIS_URL || "redis",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    SESSION_SECRET : process.env.SESSION_SECRET
    // REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    // REDIS_DB: process.env.REDIS_DB || "0",
    // JWT_SECRET: process.env.JWT_SECRET || "secret"

}