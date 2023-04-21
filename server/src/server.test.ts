import app from "~/server";
import request from "supertest";
import { User } from "@prisma/client";

const mockedUser: User = {
  signingAddress: "0x123",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const signatureUserTable: Record<string, string> = {
  "valid_new": "0x321",
  "valid_existing": "0x123"
}

jest.mock("web3", () => {
  return jest.fn().mockImplementation(() => {
    return {
      utils: {
        sha3: jest.fn().mockImplementation((message: string) => `hashed_message=${message}`)
      },
      eth: {
        accounts: {
          recover: jest.fn().mockImplementation((_: string, signature: string) => signatureUserTable[signature])
        }
      }
    }
  })
})

jest.mock("@/db", () => {
  return {
    ...jest.requireActual("@/db"),
    prisma: {
      user: {
        findUnique: jest.fn().mockImplementation(({ where: { signingAddress } }: { where: { signingAddress: string } }) => Promise.resolve(signingAddress === "0x123" ? mockedUser : null)),
        create: jest.fn().mockImplementation(() => Promise.resolve({}))
      }
    }
  }
})

describe("Server", () => {
  it("should report an error on invalid route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(404);
  })

  describe("Auth endpoint", function () {
    it("should report an error on invalid method", async () => {
      const response = await request(app).get("/api/auth")
      expect(response.statusCode).toBe(404);
    })

    it("should return a 400 on empty payload", async () => {
      const response = await request(app).post("/api/auth");
      expect(response.statusCode).toBe(400);
    })

    it("should return a 401 on invalid signature", async () => {
      const response = await request(app).post("/api/auth").send({ signature: "invalid" });
      expect(response.statusCode).toBe(401);
    })

    it("should return a 201 on valid route, if a new user", async () => {
      const signature = "valid_new";
      const response = await request(app).post("/api/auth").send({ signature });
      expect(response.statusCode).toBe(201);
      const headers = response.headers as Record<string, string>;
      expect(headers["access-control-allow-origin"]).toBe("*");
      expect(headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE");
      expect(headers["access-control-allow-headers"]).toBe("Content-Type, Authorization");
      expect(headers["access-control-allow-credentials"]).toBe("true");
      expect(response.get("Set-Cookie")).toStrictEqual([`AUTH_TOKEN=${signature}; Path=/`]);
      expect(response.body).toMatchObject({});
    })

    it("should return a 200 on valid route, if an existing user", async () => {
      const signature = "valid_existing";
      const response = await request(app).post("/api/auth").send({ signature });
      expect(response.statusCode).toBe(200);
      const headers = response.headers as Record<string, string>;
      expect(headers["access-control-allow-origin"]).toBe("*");
      expect(headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE");
      expect(headers["access-control-allow-headers"]).toBe("Content-Type, Authorization");
      expect(headers["access-control-allow-credentials"]).toBe("true");
      expect(response.get("Set-Cookie")).toStrictEqual([`AUTH_TOKEN=${signature}; Path=/`]);
      expect(response.body).toMatchObject({});
    })
  });

  describe("User endpoint", function () {
    it("should report 404 error on invalid method", async () => {
      const response = await request(app).post("/api/user");
      expect(response.statusCode).toBe(404);
    })

    it("should return a 404 on empty id", async () => {
      const response = await request(app).get("/api/user/");
      expect(response.statusCode).toBe(404);
    })

    it("should return a 401 if no token provided", async () => {
      const response = await request(app).get("/api/user/0x123");
      expect(response.statusCode).toBe(401);
    })

    it("should return a 401 if invalid token", async () => {
      const response = await request(app).get("/api/user/0x123").set("Cookie", "AUTH_TOKEN=invalid");
      expect(response.statusCode).toBe(401);
    })

    it("should return a 404 if no user info", async () => {
      const response = await request(app).get("/api/user/0x321").set("Cookie", "AUTH_TOKEN=valid_new");
      expect(response.statusCode).toBe(404);
    })

    it("should return a 200 on valid route", async () => {
      const response = await request(app).get("/api/user/0x123").set("Cookie", "AUTH_TOKEN=valid_existing");
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        signingAddress: mockedUser.signingAddress,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      const headers = response.headers as Record<string, string>;
      expect(headers["access-control-allow-origin"]).toBe("*");
      expect(headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE");
      expect(headers["access-control-allow-headers"]).toBe("Content-Type, Authorization");
      expect(headers["access-control-allow-credentials"]).toBe("true");
    })
  });

})