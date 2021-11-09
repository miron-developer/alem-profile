const formDataToString = (data = new FormData()) => {
  let res = "";
  for (let [k, v] of data.entries()) res += k + "=" + v + "&";
  return res.slice(0, -1);
};

// convert from object to URLSearchParams
export const PrepareDataToFetch = (datas = {}) => {
  const data = new FormData();
  for (let [k, v] of Object.entries(datas)) data.append(k, v);
  return data;
};

/**
 * use fetching by both method
 * @param {string} action - where to send req
 * @param {object} data - which data send in object
 * @param {string} method - method req
 * @param {boolean} isNeedConvert - is need convert object to formdata
 * @returns
 */
export const Fetching = async (
  action,
  data = {},
  method = "POST",
  isNeedConvert = true
) => {
  if (action === undefined) return { err: "action undefined" };
  data = isNeedConvert ? PrepareDataToFetch(data) : data;

  const fetchOption = { method: method, mode: "cors", credentials: "include" };
  if (method === "GET") action += "?" + encodeURI(formDataToString(data));
  else fetchOption["body"] = data;

  return await fetch(action, fetchOption)
    .then((resp) => {
      if (resp.status !== 200) return { err: "сервис не доступен" };
      return resp.json();
    })
    .catch((err) => Object.assign({}, { err: err }));
};

export const API = {
  GraphqlEndpoint: "https://01.alem.school/api/graphql-engine/v1/graphql",

  GetUsersList: async (data = {}) => {
    return await Fetching(
      API.GraphqlEndpoint,
      JSON.stringify(data),
      "POST",
      false
    );
  },

  GetUserTransactions: async (id = 0, offset = 0) => {
    return await Fetching(
      API.GraphqlEndpoint,
      JSON.stringify({
        query: `query{
            user(where: {id: {_eq: ${id}}}) {
              transactions(order_by: {createdAt: desc}, offset: ${offset}, limit: 50) {
                amount
                createdAt
                type
                object {
                  type
                  name
                }
              }
            }
          }`,
        variables: null,
      }),
      "POST",
      false
    );
  },
};
