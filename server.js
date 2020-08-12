require("isomorphic-fetch");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const dotenv = require("dotenv");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

dotenv.config();

const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
  const server = new Koa();

  server.use(session({ sameSite: "none", secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  //! scopes: client가 어떤 데이터에 access하길 허용할 것인지 설정
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ["read_products", "read_script_tags", "write_script_tags"],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        //! shop: shop URL
        //! 아래 세번째 옵션 설정 이유: app은 shopify site admin iframe안에서 구동되기에 크롬의 경우 http, samesite 등이 아닐 시 에러 메시지를 console.log에 출력한다. 이를 방지하기 위해 설정해주는 것.
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.October19 }));

  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  //! ctx : context. 앞으로 호출할 모든 메소드, 속성을 가진 obj.
  // server.use(async (ctx) => (ctx.body = "Hello Koa App"));

  server.listen(port, () =>
    console.log("😍 Ready on http://localhost:${port}")
  );
});
