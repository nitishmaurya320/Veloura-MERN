export const StarRating = ({ rating, max = 5 }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? "#facc15" : "#d1d5db",
          fontSize: "18px",
        }}
      >
        ★
      </span>
    ))}
  </div>
);
