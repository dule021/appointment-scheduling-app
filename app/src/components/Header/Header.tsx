import dogLogo from "../../assets/dog_logo.png";
import "./header.css";

export const Header = () => (
  <header className="header">
    <div className="header__logo">
      <img src={dogLogo} alt="main logo" />
    </div>
    <h1 className="header-title">
      Fluffy tail <span className="header-title__secondary">Puppy Spa</span>
    </h1>
  </header>
);
