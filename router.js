const routes = {
    "/web/login": "/web/pages/login.html",
    "/web/register": "/web/pages/register.html",
    "/web/profile": "/web/pages/profile.html",
    "/web/import": "/web/pages/import.html",
    "/web/endpoint": "/web/pages/endpoint.html"
};




// 获取 API 基础 URL，从环境变量中读取
// const apiEndpoint = import.meta.env.VITE_API_BASE_URL;

// 动态加载菜单栏
const loadMenu = async () => {
    const response = await fetch('/web/components/menu.html'); // 使用 /web/ 前缀
    const menuHtml = await response.text();
    document.querySelector("#menu").innerHTML = menuHtml;
};



// 动态加载 HTML 并插入到 #app 中
const loadPage = async (path) => {
  const route = routes[path] || routes["/web/login"];
  try {
    await loadMenu();
    // await loadEndpointSetting(); // 加载 Endpoint 设置
    const response = await fetch(route);
    const html = await response.text();
    document.querySelector("#app").innerHTML = html;
    initializeForm(path);  // 在页面内容加载之后再初始化表单逻辑
  } catch (error) {
    console.error("Error loading page:", error);
    document.querySelector("#app").innerHTML = "<p>Failed to load page.</p>";
  }
};

const getToken = () => localStorage.getItem("token");
const getApiEndpoint = () => localStorage.getItem("apiEndpoint");

// 简单的路由监听
const router = () => {
  const path = window.location.pathname;
  loadPage(path);
};




// 初始化表单事件
const initializeForm = (path) => {
    const apiEndpoint = getApiEndpoint(); // 从 localStorage 获取 API 端点

    if (!apiEndpoint && path !== "/web/endpoint") {
      document.querySelector("#app").innerHTML = `<div class="alert alert-danger">请先设置 API 端点。<a href="/web/endpoint">点击设置</a></div>`;
      return;
    }

  if (path === "/web/endpoint") {
    const setEndpointBtn = document.querySelector("#set-endpoint-btn");
    const endpointInput = document.querySelector("#api-endpoint");
    const endpointMessage = document.querySelector("#endpoint-message");

    setEndpointBtn.addEventListener("click", () => {
      const endpoint = endpointInput.value.trim();
      if (endpoint) {
        localStorage.setItem("apiEndpoint", endpoint); // 存储端点到 localStorage
        endpointMessage.textContent = `已设置 API 端点为: ${endpoint}`;
      } else {
        endpointMessage.textContent = "请设置一个有效的 API 端点。";
      }
    });

    // 如果已经有存储的端点，显示它
    const savedEndpoint = getApiEndpoint();
    if (savedEndpoint) {
      endpointInput.value = savedEndpoint;
      endpointMessage.textContent = `当前 API 端点为: ${savedEndpoint}`;
    }
  }



  if (path === "/web/login") {
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.querySelector("#login-username").value;
        const email = "snowywar@gmail.com"; // 使用硬编码的 email（根据需求调整）
        const password = document.querySelector("#login-password").value;
        const turnstile = "turnstile_value"; // 使用硬编码的 turnstile 值（根据需求调整）

        // 将请求数据编码为 x-www-form-urlencoded 格式
        const formData = new URLSearchParams();
        formData.append("username", "username");
        formData.append("email", username);
        formData.append("password", password);
        formData.append("turnstile", turnstile);

        try {
          const response = await fetch(`${apiEndpoint}/user/login`, {
            method: "POST",
            headers: {
              "User-Agent": "Apifox/1.0.0 (https://apifox.com)",  // 模拟 User-Agent
              "Content-Type": "application/x-www-form-urlencoded",  // 设置请求头
            },
            body: formData.toString(),  // 使用 URL 编码的请求体
          });

          const data = await response.json();
          if (response.ok) {
            localStorage.setItem("token", data.token);
            document.querySelector("#message").innerHTML = `<div class="alert alert-success">Login successful! Welcome back, ${data.username}</div>`;
            setTimeout(() => {
                window.location.href = "/web/profile"; // 假设用户信息页为 /web/profile
              }, 1000);
          } else {
            document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Login failed: ${data.message}</div>`;
          }
        } catch (error) {
          document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
      });
    }
  } else if (path === "/web/register") {
    const registerForm = document.querySelector("#register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        const email = document.querySelector("#email").value;

        // 将请求数据编码为 x-www-form-urlencoded 格式
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("turnstile", "turnstile_value");

        try {
          const response = await fetch(`${apiEndpoint}/user/register`, {
            method: "POST",
            headers: {
              "User-Agent": "Apifox/1.0.0 (https://apifox.com)",  // 模拟 User-Agent
              "Content-Type": "application/x-www-form-urlencoded",  // 设置请求头
            },
            body: formData.toString(),  // 使用 URL 编码的请求体
          });

          const data = await response.json();
          if (response.ok) {
            document.querySelector("#message").innerHTML = `<div class="alert alert-success">Registration successful! Welcome, ${data.username}</div>`;
            setTimeout(() => {
                window.location.href = "/web/login";
              }, 1000);
          } else {
            document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${data.message}</div>`;
          }
        } catch (error) {
          document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
      });
    }
  }else {
       // 检查用户是否已登录，未登录则跳转到登录页面
    //    const token = getToken();
    //    if (!token) {
    //      window.location.href = "/web/login";
    //      return;
    //    }
   
       // 请求用户信息页面时带上 token
       if (path === "/web/profile") {
         fetchUserProfile(token);
         bindLinkCard(token);
       }
       if (path === "/web/import") {
        const importForm = document.querySelector("#import-form");
        const exportBtn = document.querySelector("#export-btn");
        if (importForm) {
          importForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = document.querySelector("#json-file");
            const token = getToken();
    
            // 检查是否上传了文件
            if (!fileInput.files.length) {
              document.querySelector("#message").innerHTML = `<div class="alert alert-danger">请上传一个 JSON 文件。</div>`;
              return;
            }
    
            // 读取文件内容
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = async function(event) {
              const fileContent = event.target.result;
    
              try {
                // 发送文件内容到 API
                const response = await fetch(`${apiEndpoint}/game/mai2/import?token=${token}`, {
                  method: "POST",
                  headers: {
                    "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
                    "Content-Type": "application/json",
                  },
                  body: fileContent // 发送文件的原始内容
                });
    
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                  data = await response.json(); // 解析为 JSON
                } else {
                  data = await response.text(); // 解析为普通文本
                }
    
                if (response.ok) {
                  document.querySelector("#message").innerHTML = `<div class="alert alert-success">文件上传成功！</div>`;
                } else {
                  document.querySelector("#message").innerHTML = `<div class="alert alert-danger">文件上传失败: ${data}</div>`;
                }
              } catch (error) {
                document.querySelector("#message").innerHTML = `<div class="alert alert-danger">文件上传失败: ${error.message}</div>`;
              }
            };
    
            reader.readAsText(file); // 以文本形式读取文件内容
          });
        }
        // 处理文件导出
    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
          const token = getToken();
          if (!token) {
            document.querySelector("#message").innerHTML = `<div class="alert alert-danger">请先登录。</div>`;
            return;
          }
  
          try {
            const response = await fetch(`${apiEndpoint}/game/mai2/export?token=${token}`, {
              method: "GET",
              headers: {
                "User-Agent": "Apifox/1.0.0 (https://apifox.com)"
              }
            });
  
            if (response.ok) {
              // 将返回的数据转换为 Blob 并触发下载
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = "exported_data.json"; // 设置下载文件的名称
              document.body.appendChild(a);
              a.click(); // 触发下载
              window.URL.revokeObjectURL(url); // 释放 URL 对象
              document.querySelector("#message").innerHTML = `<div class="alert alert-success">文件导出成功！</div>`;
            } else {
              const errorText = await response.text();
              document.querySelector("#message").innerHTML = `<div class="alert alert-danger">文件导出失败: ${errorText}</div>`;
            }
          } catch (error) {
            document.querySelector("#message").innerHTML = `<div class="alert alert-danger">文件导出失败: ${error.message}</div>`;
          }
        });
      }
      }
     }
};


// 请求用户信息的函数
const fetchUserProfile = async (token) => {
    try {
      const apiEndpoint = getApiEndpoint(); // 从 localStorage 获取 API 端点
      const response = await fetch(`${apiEndpoint}/user/me?token=${token}`);
      const data = await response.json();
  
      if (response.ok) {
        // 填充用户数据到 profile.html 中的 DOM 元素
        document.querySelector("#username").textContent = data.username;
        document.querySelector("#email").textContent = data.email;
        document.querySelector("#displayName").textContent = data.displayName || "N/A";
        document.querySelector("#country").textContent = data.country;
        document.querySelector("#emailConfirmed").textContent = data.emailConfirmed ? "Yes" : "No";
        document.querySelector("#lastLogin").textContent = new Date(data.lastLogin).toLocaleString();
        document.querySelector("#regTime").textContent = new Date(data.regTime).toLocaleString();
  
        // // 填充 Ghost Card 数据
        // if (data.ghostCard) {
        //   document.querySelector("#ghost-luid").textContent = data.ghostCard.luid;
        //   document.querySelector("#ghost-registerTime").textContent = new Date(data.ghostCard.registerTime).toLocaleString();
        //   document.querySelector("#ghost-accessTime").textContent = new Date(data.ghostCard.accessTime).toLocaleString();
        //   document.querySelector("#ghost-isGhost").textContent = data.ghostCard.isGhost ? "Yes" : "No";
        //   document.querySelector("#ghost-isLinked").textContent = data.ghostCard.isLinked ? "Yes" : "No";
        // }
  
        // 检查是否有卡片数据
        const cardsContainer = document.querySelector("#cards");
        if (data.cards && data.cards.length > 0) {
          data.cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className = "card mb-3";
            cardElement.innerHTML = `
              <p><strong>LUID:</strong> ${card.luid}</p>
              <p><strong>Register Time:</strong> ${new Date(card.registerTime).toLocaleString()}</p>
              <p><strong>Access Time:</strong> ${new Date(card.accessTime).toLocaleString()}</p>
              <p><strong>Is Ghost:</strong> ${card.isGhost ? "Yes" : "No"}</p>
              <p><strong>Is Linked:</strong> ${card.isLinked ? "Yes" : "No"}</p>
            `;
            cardsContainer.appendChild(cardElement);
          });
        } else {
          // 如果没有卡片信息，显示提示
          cardsContainer.innerHTML = `<p>您尚未绑定任何卡片。</p>`;
        }
  
      } else {
        document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${data.message}</div>`;
      }
    } catch (error) {
      document.querySelector("#message").innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
  };
  
  // 绑定 "绑卡" 按钮的事件
  const bindLinkCard = (token) => {
    const linkCardBtn = document.querySelector("#link-card-btn");
    linkCardBtn.addEventListener("click", async () => {
      const cardId = document.querySelector("#card-id").value;
  
      if (!cardId) {
        document.querySelector("#message").innerHTML = `<div class="alert alert-danger">请填写卡号。</div>`;
        return;
      }
  
      try {
        const apiEndpoint = getApiEndpoint(); // 从 localStorage 获取 API 端点
        const response = await fetch(`${apiEndpoint}/card/link?cardId=${cardId}&migrate=&token=${token}`, {
          method: "POST",
          headers: {
            "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
  
        // const data = await response.json();
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json(); // 解析为 JSON
        } else {
          data = await response.text(); // 解析为普通文本
        }
  
  
        if (response.ok) {
          document.querySelector("#message").innerHTML = `<div class="alert alert-success">卡片绑定成功！</div>`;
        } else {
          document.querySelector("#message").innerHTML = `<div class="alert alert-danger">卡片绑定失败: ${data}</div>`;
        }
      } catch (error) {
        document.querySelector("#message").innerHTML = `<div class="alert alert-danger">卡片绑定失败: ${error}</div>`;
      }
    });
  };
  

// 监听浏览器前进后退按钮
window.addEventListener("popstate", router);

// 初始加载路由
window.addEventListener("DOMContentLoaded", () => {
  router();
});