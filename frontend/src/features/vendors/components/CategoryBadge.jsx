import '../styles/shared.css';

export default function CategoryBadge({ categoryName }) {
    return (
        <span className="vendors-category-chip bg-blue-50 text-blue-700">
            {categoryName}
        </span>
    );
}