import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ethereum } from "../../contracts/getContract";
import {
  bsc,
  chainAdd,
  chainCheck,
  chainSet,
  getContract,
} from "../../contracts/funcs";
import Alert from "../Alert/Alert";

const gamesArr = [
  {
    id: 1,
    name: "flipper",
    path: "/",
  },
  {
    id: 2,
    name: "lotto",
    path: "/lotto",
  },
];

const Header = ({ account, handleLogIn, isExited, handleLogOut, walletConnectHandler }) => {
  const [walletActive, setWalletActive] = React.useState(false);
  const [headerActive, setHeaderActive] = React.useState(false);
  const [activeGame, setActiveGame] = React.useState(1);
  const location = useLocation();
  const isNetworkCorrect = chainCheck() === false && account;

  const [chainId, setChainId] = React.useState(ethereum?.chainId);
  const [buttonTxt, setButtonTxt] = React.useState();

    ethereum?.on("chainChanged", (_chainId) => setChainId(_chainId));

  const setWallet = () => {
    setWalletActive(!walletActive);
  };

  React.useEffect(() => {
    gamesArr.map((d) => {
      location.pathname === d.path && setActiveGame(d.id);
    });
  }, [location]);

  React.useEffect(() => {
    async function fresh() {
      if (isExited === null && await walletConnectHandler(false)) {
        setChainId(ethereum.chainId);
      }
    }
    fresh();
  }, []);

  const setHeader = () => {
    setHeaderActive(!headerActive);
  };

  return (
    <React.Fragment>
      {isNetworkCorrect ? (
        <Alert open={isNetworkCorrect}>
          You're viewing data from the main network, but your wallet is
          connected to the test network (BSC Testnet). To use OpenSea, please
          switch to{" "}
          <a href="https://testnets.opensea.io">testnets.opensea.io</a>
        </Alert>
      ) : null}
      <header className="header">
        <div
          className={`menu__shadow${
            headerActive || walletActive ? " active" : ""
          }`}
        ></div>
        <div className="container">
          <div className="header__inner">
            {!headerActive ? (
              <div className="header__logo" onClick={setHeader}>
                <img
                  className="logo__img"
                  src="/assets/img/logo-figure.svg"
                  alt="logo"
                />
                <span className="yellow">SMART</span>
                {gamesArr.map((d, id) => (
                  <p key={id}>{activeGame === d.id && d.name}</p>
                ))}
              </div>
            ) : (
              <div className="header__logo" onClick={setHeader}>
                <img
                  className="logo__img flip"
                  src="/assets/img/logo-figure.svg"
                  alt="logo"
                />

                {gamesArr.map(
                  (d, id) =>
                    activeGame === d.id && (
                      <Link key={id} className="header__logo" to={d.path}>
                        <span className="yellow">SMART</span>
                        {d.name}
                      </Link>
                    )
                )}

                <div className="header__logo--inner active">
                  {gamesArr.map(
                    (d, id) =>
                      activeGame !== d.id && (
                        <Link key={id} className="header__logo" to={d.path}>
                          <span className="yellow">SMART</span>
                          {d.name}
                        </Link>
                      )
                  )}
                </div>
              </div>
            )}

            <div className="wallet__wrapper">
              <button
                className="button default__button yellow"
                onClick={() => {
                  if (account && isExited === null) {
                    setWallet();
                  } else {
                    handleLogIn();
                    walletConnectHandler();
                  }
                }}
              >
                <span className="default__button--wrapper active">
                  {account
                    ? account?.slice(0, 5) + "..." + account?.slice(-5)
                    : "Connect Wallet"}
                  {account ? (
                    <img
                      className="default__button--img"
                      src="assets/img/logo-figure.svg"
                      alt="Картинка"
                    />
                  ) : null}
                </span>
              </button>

              <div className={`wallet__drop${walletActive ? " active" : ""}`}>
                <div className="wallet__value">{account}</div>

                <button
                  onClick={() => {
                    handleLogOut();
                    setWalletActive(false);
                    setHeaderActive(false);
                  }}
                  className="wallet__button"
                >
                  Disconnect
                  <img src="assets/img/logout.svg" alt="Выйти" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
