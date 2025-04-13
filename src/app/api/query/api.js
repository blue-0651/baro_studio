//read
export const getQuery = async (url) => {
  const response = await fetch(`${url}`);
  const result = await response.json();
  return result.success ? result.data : [];
};
//readDetail
export const getQueryDetail = async (url) => {
  const response = await fetch(`${url}`);
  let result = [];
  if (response.ok) {
    result = await response.json();
  }
  return result;
};
//create
export const postQuery = async (url, insertData) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insertData),
  });

  const result = await res.json();
  return result.success ? result : [];
};
//put
export const putQuery = async (url, updateData) => {
  const res = await fetch(`${url}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  const result = await res.json();
  return result.success ? result : [];
};

//delete
export const deleteQuery = async (url, deleteData) => {
  const res = await fetch(`${url}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteData),
  });
  const result = await res.json();
  return result.success ? result : [];
};
