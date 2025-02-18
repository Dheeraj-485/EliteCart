
export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export async  function loginUser(loginInfo) {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials:"include",
        body: JSON.stringify(loginInfo),
        headers: { 'content-type': 'application/json' },
      });
       
      // console.log("Login response",token);
      
      if (response.ok) {
        const data = await response.json();
        console.log("data",data);
        // return ({ data });
        const token =data?.token
        if(token){
          // const token=response?.data?.token;
      localStorage.setItem("token", token);
        }else{
          console.error("token not found in response")
        }
    return {data};
      } else {
        const error = await response.text();
        return (error);
      }
    } catch (error) {
      return ( error );
    }

  
  }

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
// const token=JSON.parse(localStorage.getItem('token'));
// const headers=token ?{Authorization:`Bearer ${token},'content-type:application/json`}:{'Content-Type':'application/json'}

      const response = await fetch('http://localhost:8080/auth/check',);
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject( error );
    }

  });
}


export function signOut(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/auth/logout');
      if (response.ok) {
        resolve({ data:'success' });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      console.log(error)
      reject( error );
    }
  });
}


export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/auth/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: { 'content-type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject( error );
    }

  });
}

export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject( error );
    }

  });
}
