//SERVER config only!
const env = process.env;
export default {
    productionUrl: "http://this-way.herokuapp.com",
    originEmail: "moghadam@live.at",
    nodeEnv: env.NODE_ENV || "development",
    adminEmail: "admin@admin.admin", //written in the database -login
    adminPw: "Hi123456", //written in the database - login
    mongodbUri: "mongodb://admin:hi123@ds259258.mlab.com:59258/thisway",
    db: "thisway",
    port: env.PORT || 8080,
    host: env.HOST || "0.0.0.0",
    secret: "test",
    AWS_ACCESS_KEY_ID: "test",
    AWS_SECRET_ACCESS_KEY: "test",
    S3_BUCKET_NAME: "arn:aws:s3:::this-way",
    imageUploadOptions: [
        {width: 500, height: 400, filePrefix: "small-"},
        {width: 900, height: 700, filePrefix: "middle-"},
        {width: 1400, height: 1100, filePrefix: "big-"},
    ],
    get serverUrl() {
        return `http://${this.host === "0.0.0.0" ? "localhost" : this.host}:${this.port}`;
    }
};


