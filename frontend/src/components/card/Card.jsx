import "./Card.css";

function Card({ children }) {
  return <div className="custom-card">{children}</div>;
}

export default Card;