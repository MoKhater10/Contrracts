export default function authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return {
        Authorization: "Bearer " + user,
      };
    } else {
      return {};
    }
  }

  export function authHeaders() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return {
        Authorization: "Bearer " + user,
        'Content-Type': 'application/json'
      
      };
    } else {
      return {};
    }
  }