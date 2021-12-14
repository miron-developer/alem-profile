import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AnimateWord, StopAnimation } from "utils/effects";
import { RandomKey, ReadableCount } from "utils/content";

import { setLoadingState } from "./userSlice";
import { GetTransactions } from "./transactions";
import { AggregationUserInfo } from "./aggregation";
import AuditRatio from "./audit-ratio/ratio";
import XPProgress from "./xp-progress/progress";
import XPPerProject from "./xp-per-project/project";
import styled from "styled-components";

const SUser = styled.div`
  min-height: 100vh;
  height: 100%;
  background: url("/user-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  background-attachment: fixed;

  &.user-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-notification,
  .info {
    background: #00000080;
    width: 100%;
    backdrop-filter: blur(3px);
    padding: 1rem;
    color: white;
    text-align: center;
    font-size: 1.5rem;
    font-family: monospace;
  }

  .info {
    height: 100%;

    .detailed-info {
      padding: 1rem;

      .general-info,
      .piscines {
        display: flex;
        flex-wrap: wrap;
      }

      .info-item {
        padding: 1rem;
        margin: 1rem;
        background: #93939366;
        border-radius: 5px;
        box-shadow: 5px 5px 3px 0 #00000047;
      }

      .piscine-item.info-item {
        display: flex;
        flex-direction: column;
      }
    }

    .user-info {
      margin: 1rem;
    }

    .user-progress {
      padding: 1rem;

      & > * {
        margin: 1rem;
      }
    }
  }
`;

const GNotifications = ({ loadingState }) => {
  useEffect(() => {
    StopAnimation();
    AnimateWord(".user-notification");
  }, [loadingState]);

  let text = "";

  if (loadingState === -3) {
    text = "Loading transaction error";
  } else if (loadingState === -2) {
    text = "User doesnt have any actions";
  } else if (loadingState === -1) {
    text = "Loading user error";
  } else if (loadingState === 0) {
    text = "Please choose user first";
  } else if (loadingState === 2) {
    text = "Loading user info...";
  } else if (loadingState === 4) {
    text = "Aggregation user info...";
  }

  if (text) return <div className="user-notification">{text}</div>;
  return <></>; // for react-build error
};

export default function User() {
  const {
    userInfo,
    transactions,
    loadingState,
    xpAmount,
    level,
    transactionPiscines,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loadingState < 5) {
      StopAnimation();
      AnimateWord(".user-notification");
    }

    if (loadingState === 1) {
      dispatch(setLoadingState({ state: 2 }));
      return GetTransactions(userInfo.id, dispatch);
    }

    if (loadingState === 3) {
      dispatch(setLoadingState({ state: 4 }));
      return AggregationUserInfo(transactions, dispatch);
    }
  }, [dispatch, loadingState, transactions, userInfo]);

  if (loadingState < 5) {
    return (
      <SUser className="user-center">
        <GNotifications loadingState={loadingState} />
      </SUser>
    );
  }
  return (
    <SUser>
      <div className="info">
        <h3 className="user-info">
          {userInfo.login} ({userInfo.id})
        </h3>

        <div className="detailed-info">
          <div className="general-info">
            <div className="info-item">
              <span>Login: {userInfo.login}</span>
            </div>

            <div className="info-item">
              <span>ID: {userInfo.id}</span>
            </div>

            <div className="info-item">
              <span>XP: {ReadableCount(xpAmount)}B</span>
            </div>

            <div className="info-item">
              <span>Level: {level}</span>
            </div>
          </div>

          <div className="piscines">
            {transactionPiscines.map((p) => {
              console.log(p);
              return (
                <div key={RandomKey()} className="piscine-item info-item">
                  <span>{p.object.name}</span>
                  <span>XP: {ReadableCount(p.amount)}B</span>
                </div>
              );
            })}
          </div>
        </div>

        <AuditRatio />

        <div className="user-progress">
          <XPProgress />

          <XPPerProject />
        </div>
      </div>
    </SUser>
  );
}
