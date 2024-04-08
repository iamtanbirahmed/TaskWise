import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { Connection } from "mongoose";
import { DatabaseService } from "src/database/database.service";

describe("ListController (e2e)", () => {
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
    // Making sure no other data is present before test
    await dbConnection.collection("lists").deleteMany({});
    const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send({
      username: "john@benbria.com",
      password: "changeme",
    });
    accessToken = response.body.access_token;
  });

  afterAll(async () => {
    // clean up after the test
    await dbConnection.collection("lists").deleteMany({});
    app.close();
  });

  describe("/list (GET)", () => {
    it("should return 401 Unauthorized error when no access token added", () => {
      return request(app.getHttpServer()).get("/api/v1/list").expect(401);
    });

    it("should return 200 OK when access token is added to the header", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
