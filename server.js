require("isomorphic-fetch");
const Koa = require("koa");
const KoaRouter = require("koa-router");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const dotenv = require("dotenv");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
// koa 전용 body parser(req로부터 json 등 접근/추출 가능)
const koaBody = require("koa-body");

dotenv.config();
//! GraphiQL 사용하기 위한 추가
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");
const {
  KnownArgumentNamesOnDirectivesRule,
} = require("graphql/validation/rules/KnownArgumentNamesRule");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const server = new Koa();
const router = new KoaRouter();

let products = [];

//! Koa-router로 api endpoint 생성. ctx: context object. Koa에서 사용하는 obj
router.get("/api/products", async (ctx) => {
  try {
    ctx.body = {
      status: "success",
      data: products,
    };
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/products", koaBody(), async (ctx) => {
  try {
    const body = ctx.request.body;
    products.push(body);
    ctx.body = "Item Added";
  } catch (error) {
    console.log(error);
  }
});

router.delete("/api/products", koaBody(), async (ctx) => {
  try {
    products = [];
    ctx.body = "All items deleted!";
  } catch (error) {
    console.log(error);
  }
});

//! Router Middleware
server.use(router.allowedMethods());
server.use(router.routes());

//! authentication 이 되어야만 아래 middleware 작동
app.prepare().then(() => {
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
        //! 아래 세번째 옵션 설정 이유: app은 shopify site admin iframe안에서 구동되기에
        //! 크롬의 경우 http, samesite 등이 아닐 시 에러 메시지를 console.log에 출력한다.
        //! 이를 방지하기 위해 설정해주는 것.
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );

  //! GraphiQL 사용하기 위한 추가
  //ApiVersion은 6개월에 한번씩 업데이트되고, 1년만 유효하기에 수시로 업데이트해줘야 함.
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
