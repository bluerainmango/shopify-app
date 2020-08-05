require("isomorphic-fetch");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const dotenv = require("dotenv");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

dotenv.config();
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

        ctx.redirect("/");
      },
    })
  );

  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  //! ctx : context. 앞으로 호출할 모든 메소드, 속성을 가진 obj.
  // server.use(async (ctx) => (ctx.body = "Hello Koa App"));

  server.listen(3000, () =>
    console.log("😍 Ready on http://localhost:${port}")
  );
});
