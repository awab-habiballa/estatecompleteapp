import Card from "../card/Card";
import "./list.scss";

export default function List({ listData }) {
  return (
    <div className="list">
      {listData.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </div>
  );
}
