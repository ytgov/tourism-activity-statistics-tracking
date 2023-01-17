import { NextFunction, Request, Response } from "express";
import jwt from "express-jwt";
import axios from "axios";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config";
import { DirectoryService, UserService } from "../services";

import { sqldb } from "../data";
const db = new UserService(sqldb);

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [AUTH0_DOMAIN],
  algorithms: ["RS256"],
});

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  let sub = req.user.sub;
  const token = req.headers.authorization || "";

  let u = await db.getBySub(sub);

  if (u) {
    req.user = { ...req.user, ...u };
    return next();
  }

  await axios
    .get(`${AUTH0_DOMAIN}userinfo`, { headers: { authorization: token } })
    .then(async (resp) => {
      if (resp.data && resp.data.sub) {
        let email = resp.data.email;

        if (!email) email = `${resp.data.given_name}.${resp.data.given_name}@yukon-no-email.ca`;

        let emailUser = await db.getByEmail(resp.data.email);
        let subUser = await db.getBySub(resp.data.sub);

        if (subUser) {
          req.user = { ...req.user, ...subUser };

          next();
        } else if (emailUser) {
          await db.update(emailUser.email, { sub: resp.data.sub });
          req.user = { ...req.user, ...emailUser };

          next();
        } else {
          let directoryService = new DirectoryService();
          await directoryService.connect();

          let adUser = await directoryService.getUserByEmail(email);
          let ynet_id = "";
          let directory_id = "";

          if (adUser) {
            ynet_id = adUser.userPrincipalName
              .toLowerCase()
              .replace("@ynet.gov.yk.ca", "")
              .replace("#ext#@yukongovernment.onmicrosoft.com", "");
            directory_id = adUser.id;
          }

          let createUser = {
            email,
            sub,
            status: "Active",
            first_name: resp.data.given_name,
            last_name: resp.data.family_name,
            ynet_id,
            directory_id,
            create_date: new Date(),
          };

          await db.create(createUser);

          req.user = { ...req.user, ...createUser };

          next();
        }
      }
    })
    .catch();
}
