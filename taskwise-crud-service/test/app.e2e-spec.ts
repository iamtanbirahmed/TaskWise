import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DatabaseService } from "src/database/database.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
  });

  beforeEach(async () => {
    const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send({
      username: "john@test.com",
      password: "changeme",
    });
    accessToken = response.body.access_token;
  });

  afterAll(async () => {
    await dbConnection.collection("users").deleteMany({});
    app.close();
  });

  it("/health/check (GET)", () => {
    return request(app.getHttpServer()).get("/api/v1/health/check").expect(200).expect("Service is Healthy!!");
  });

  describe("/secured (GET)", () => {
    it("should return 401 Unauthorized error when no access token added", () => {
      return request(app.getHttpServer()).get("/api/v1/secured").expect(401);
    });

    it("should return 200 OK when access token is added to the header", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/secured")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
