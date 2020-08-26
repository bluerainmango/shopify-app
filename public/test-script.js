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
  "https://cors-anywhere.herokuapp.com/https://e99fc94ec77e.ngrok.io/api/products?shop=shop=development-store-for-sample-app.myshopify.com"
)
  .then((res) => {
    console.log("🐼 coming from fetch test-script.js", res);
    return res.json();
  })
  .then((data) => {
    console.log("🐯 fetched data in test-script.js", data.data);
    makeHeader(data.data);
  })
  .catch((error) => console.log(error));
