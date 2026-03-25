export const SkeletonCard = () => {
  return (
    <div className="card skeleton">
      <div className="skeleton-image"></div>
      <div className="details">
        <div className="skeleton-text title"></div>
        <div className="skeleton-text subtitle"></div>
      </div>
    </div>
  );
};