import axios from "axios";
import history from "../../history";
import * as types from "./actionTypes";
import { pick, keyBy } from "lodash";
import ReactGA from "react-ga";
import { loadModal } from "../modal/actions";
import { uport } from "./connector";
import { notify } from "reapop";
const isProduction = process.env.NODE_ENV === "production";

export const getUser = user => {
  return dispatch => {
    if (isProduction && user && user.id)
      ReactGA.set({ userId: user.name || user.email || user.id });
    dispatch({ type: types.GET_USER, user });
  };
};

export const removeUser = () => ({ type: types.REMOVE_USER });

export const me = () => dispatch =>
  axios
    .get("/auth/me")
    .then(res => dispatch(getUser(res.data || {})))
    .catch(err => console.log(err));

export const auth = (userInfo, method) => dispatch => {
  userInfo =
    method === "login" ? pick(userInfo, ["email", "password"]) : userInfo;
  return axios
    .post(`/auth/${method}`, userInfo)
    .then(
      res => {
        dispatch(getUser(res.data));
        if (res.data.restricted_access) history.push("/user/profile/about");
        else if (!res.data.name)
          history.push({
            pathname: "/user/profile/about",
            state: { edit: true, basicInfoMissing: true }
          });
        else
          history.push(
            history.location.state
              ? history.location.state.lastPath
              : "/"
          );
      },
      authError => {
        // rare example: a good use case for parallel (non-catch) error handler
        dispatch(getUser({ error: authError }));
      }
    )
    .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr));
};

export const logout = () => dispatch =>
  axios
    .post("/auth/logout")
    .then(res => {
      history.push("/login");
      dispatch(removeUser());
    })
    .catch(err => console.log(err));

export const editProfile = profile => dispatch =>
  axios
    .put("/auth/profile", profile)
    .then(res => {
      dispatch({ type: types.PROFILE_UPDATED, profile });
    })
    .catch(err => console.log(err));

export const signinWithUport = () => dispatch =>
  uport
    .requestCredentials({
      requested: ["name", "email"]
    })
    .then(userProfile => axios.post("/auth/uport", userProfile))
    .then(
      res => {
        const { user, authRedirectPath } = res.data;
        dispatch(getUser(user));
        if (user.restricted_access) history.push("/user/profile/about");
        else if (!user.name)
          history.push({
            pathname: "/user/profile/about",
            state: { edit: true, basicInfoMissing: true }
          });
        else
          history.push(
            authRedirectPath
              ? authRedirectPath
              : history.location.state
                ? history.location.state.lastPath
                : "/"
          );
      },
      authError => {
        dispatch(getUser({ error: authError }));
      }
    )
    .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr));

export const verifyUportOnMobile = accessToken => async dispatch => {
  try {
    const { user, authRedirectPath } = await axios
      .post("/auth/uport/mobile", { accessToken })
      .then(res => res.data);
    dispatch(getUser(user));
    if (user.restricted_access) history.push("/user/profile/about");
    else if (!user.name)
      history.push({
        pathname: "/user/profile/about",
        state: { edit: true, basicInfoMissing: true }
      });
    else history.push(authRedirectPath || "/");
  } catch (authError) {
    dispatch(getUser({ error: authError }));
  }
};

export const fetchManagedProjects = () => async (dispatch, getState) => {
  try {
    const projects = await axios
      .get(`/api/users/-/projects`)
      .then(res => res.data);
    const projectsBySymbol = keyBy(projects, "symbol");
    const projectSymbolArr = projects.map(project => project.symbol);
    dispatch({
      type: types.MANAGED_PROJECTS_FETCH_SUCCESS,
      projectsBySymbol,
      projectSymbolArr
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchOwnDocuments = () => async (dispatch, getState) => {
  try {
    const documents = await axios
      .get(`/api/users/-/documents`)
      .then(res => res.data);
    const documentsById = keyBy(documents, "id");
    const documentIds = documents.map(ps => ps.id);
    dispatch({
      type: types.OWN_SURVEYS_FETCH_SUCCESS,
      documentsById,
      documentIds
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateOnboardStatus = () => dispatch =>
  axios
    .put(`/auth/profile/onboard`)
    .then(res => res.data)
    .then(dispatch({ type: types.ONBOARD_STATUS_UPDATED }))
    .catch(err => console.log(err));

export const requestPasswordReset = email => dispatch =>
  axios
    .put("/auth/reset-password", { email })
    .then(res => {
      history.push("/login");
      dispatch(
        notify({
          title:
            "You will receive an email with instructions about how to reset your password in a few minutes.",
          message: "",
          status: "success",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    })
    .catch(err =>
      dispatch(
        notify({
          title: "Something went wrong. ",
          message: "Please try again later.",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      )
    );

export const resetPassword = ({ password, token }) => dispatch =>
  axios
    .put(`/auth/reset-password/${token}`, { password })
    .then(res => {
      dispatch(getUser(res.data));
      dispatch(
        notify({
          title: "Your password has been reset.",
          message: "",
          status: "success",
          dismissible: true,
          dismissAfter: 3000
        })
      );
      if (res.data.restricted_access) history.push("/user/profile/about");
      else if (!res.data.name)
        history.push({
          pathname: "/user/profile/about",
          state: { edit: true, basicInfoMissing: true }
        });
      else history.push("/project/BKP/document/1/version/1");
    })
    .catch(err => {
      if (err.response && err.response.status === 404) {
        dispatch(
          notify({
            title: "Reset password link is not valid",
            message: "",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      } else if (err.response && err.response.status === 410) {
        history.push("/request-password-reset");
        dispatch(
          notify({
            title: "The link has expired. Reset your password again here.",
            message: "",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      } else if (err.response && err.response.status === 400) {
        dispatch(
          notify({
            title: "Something went wrong",
            message: "Please try again later.",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      }
    });
