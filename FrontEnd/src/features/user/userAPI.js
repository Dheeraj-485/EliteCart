export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/orders/own/',{
      method: 'GET',
      credentials:"include"
    }) 
    const data = await response.json()
    resolve({data})
  }
  );
}


export async function fetchLoggedInUser() {

  const token=localStorage.getItem("token")
  console.log("token",token)
    const response = await fetch('http://localhost:8080/users/own',{
      // headers: {'Authorization': `Bearer ${token}`},
      credentials:"include"
    }) 
    const data = await response.json()
    console.log("User info ",data);
    
    return ({data})
  }
  


export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/users/'+update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
      credentials:"include"
    });
    const data = await response.json();
    resolve({ data });
  });
}


