import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./router.js";




// document.querySelector("#register-form").addEventListener("submit", async (e) => {
//   e.preventDefault(); // 阻止表单提交刷新页面

//   // 获取表单数据
//   const username = document.querySelector("#username").value;
//   const password = document.querySelector("#password").value;

//   try {
//     // 发送 POST 请求到注册 API
//     const response = await fetch("http://129.226.173.169/api/v2/user/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username,
//         password,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       document.querySelector("#message").innerHTML = `<div class="alert alert-success">Registration successful! Welcome, ${data.username}</div>`;
//     } else {
//       document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${data.message}</div>`;
//     }
//   } catch (error) {
//     document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
//   }
// });

// // 添加登录逻辑
// document.querySelector("#login-form").addEventListener("submit", async (e) => {
//   e.preventDefault(); // 阻止表单提交刷新页面

//   // 获取登录表单数据
//   const username = document.querySelector("#login-username").value;
//   const password = document.querySelector("#login-password").value;

//   try {
//     // 发送 POST 请求到登录 API
//     const response = await fetch("http://129.226.173.169/api/v2/user/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username,
//         password,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       document.querySelector("#message").innerHTML = `<div class="alert alert-success">Login successful! Welcome back, ${data.username}</div>`;
//     } else {
//       document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Login failed: ${data.message}</div>`;
//     }
//   } catch (error) {
//     document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
//   }
// });



// setupCounter(document.querySelector('#counter'))
