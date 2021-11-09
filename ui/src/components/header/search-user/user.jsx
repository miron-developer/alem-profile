import { useDispatch } from "react-redux";

import { API } from "utils/api";
import { Debounce, SetListData } from "utils/effects";
import { useInput } from "utils/form";
import {
  clearUserAllInfo,
  setLoadingState,
  setUser,
} from "components/user/userSlice";

import styled from "styled-components";

const SSearchUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// temporary store users
let users = [];

const onChange = Debounce((e, input, dispatch) => {
  const loginPart = e.target.value;
  input.setCertainValue(loginPart);

  const user = users.find((u) => u.login === loginPart);
  // if we choose user from datalist
  if (user) {
    dispatch(clearUserAllInfo({}));
    dispatch(setUser({ userInfo: { login: user.login, id: user.id } }));
    dispatch(setLoadingState({ state: 1 }));
    return;
  }

  // else get user logins from API
  API.GetUsersList({
    query: `query{
      user(where: {login: {_like: "%${loginPart}%"}}) {
        id
        login
      }
    }`,
    variables: null,
  }).then((resp) => {
    if (resp.errors) return;

    users = resp?.data?.user;

    // fill datalist
    SetListData("login-list", resp?.data?.user, ({ id, login }) => {
      const op = document.createElement("option");
      op.value = login;
      op.textContent = login + "(" + id + ")";
      return op;
    });
  });
}, 300);

export default function SearchUser() {
  const input = useInput();

  const dispatch = useDispatch();

  return (
    <SSearchUser>
      <div className="form-floating">
        <input
          type="text"
          id="name"
          className="form-control"
          list="login-list"
          placeholder="Type to search user"
          title="Type to search user"
          onChange={(e) => onChange(e, input, dispatch)}
        />
        <label htmlFor="name">Type to search user</label>
        <datalist id="login-list"></datalist>
      </div>
    </SSearchUser>
  );
}
