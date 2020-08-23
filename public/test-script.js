console.log("This is coming from script tag api!!");

const header = $("header.site-header").parent();

const makeHeader = (data) => {
  header
    .prepend(`<div>${data}</div>`)
    .css({ "background-color": "orange", "text-align": "center" });
};

//! server.js에서 설정한 api endpoint 의 data 의 텍스트를 css 변경해준 후 prepend 해주기
//! cors-anywhere은 core alert방지 위해 추가
fetch(
  "https://cors-anywhere.herokuapp.com/https://a3ffbbc090d4.ngrok.io/api/products?shop=shop=development-store-for-sample-app.myshopify.com"
)
  .then((res) => res.json())
  .then((data) => {
    makeHeader(data.data);
  })
  .catch((error) => console.log(error));
