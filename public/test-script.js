//! Header
// console.log("This is coming from script tag api!!");

// const header = $("header.site-header").parent();

// const makeHeader = (data) => {
//   header
//     .prepend(`<div>${data}</div>`)
//     .css({ "background-color": "orange", "text-align": "center" });
// };

const body = $("body");

body.css({
  position: "relative",
});

const shop = Shopify.shop;

const makeApp = (products) => {
  const bestSellerContainer = $(
    `<div style="overflow-y: 'scroll';">
        <h3>Our Best Sellers</h3>
        ${products
          .map((item) => {
            return `
            <a href="/products/${item.handle}" style="display: flex; align-items: center; padding: 20px 10px; border-top: 1px solid black;">
              <img src=${item.images[0].originalSrc} style="width:75px;" />
              <div style="style:flex; justify-content: space-between; align-items:start; width:100%;">
                <p style="padding: 0 10px;">${item.title}</p>
                <p>${item.variants[0].price}</p>
              </div>
            </a>`;
          })
          .join("")}
    </div>`
  ).css({
    position: "fixed",
    "background-color": "#ffffff",
    padding: "10px",
    border: "1px solid black",
    bottom: "80px",
    right: "25px",
    height: "400px",
    width: "350px",
    display: "none",
  });

  const bestSellerButton = $(`<img />`)
    .attr(
      "src",
      "https://cdn.shopify.com/s/files/1/0325/3174/2765/files/bestseller-button-trans.png"
    )
    .css({
      position: "fixed",
      width: "150px",
      bottom: "20px",
      right: "20px",
      cursor: "pointer",
    });

  body.append(bestSellerButton);
  body.append(bestSellerContainer);

  bestSellerButton.click(() => {
    bestSellerContainer.slideToggle();
  });
};

//! server.js에서 설정한 api endpoint 의 data 의 텍스트를 css 변경해준 후 prepend 해주기
//! cors-anywhere은 core alert방지 위해 추가
fetch(
  "https://cors-anywhere.herokuapp.com/https://56ab801402af.ngrok.io/api/products?shop=shop=development-store-for-sample-app.myshopify.com"
)
  .then((res) => {
    console.log("🐼 coming from fetch test-script.js", res);
    return res.json();
  })
  .then((data) => {
    console.log("🐯 fetched data in test-script.js", data.data);
    // makeHeader(data.data);
    makeApp(data.data);
  })
  .catch((error) => console.log(error));
