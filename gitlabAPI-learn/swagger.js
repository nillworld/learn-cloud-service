const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const options = {
  info: {
    title: "This is my API Document",
    description: "이렇게 스웨거 자동생성이 됩니다.",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },
  },
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js", "./routes/index.js"];
swaggerAutogen(outputFile, endpointsFiles, options);
