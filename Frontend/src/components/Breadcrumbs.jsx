import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items, separator = <ChevronRight className="w-3 h-3 mx-1" />, className = '' }) => {
    return (
        <div className={`text-sm breadcrumbs mb-4 ${className}`}>
            <ul>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.to ? (
                            <Link
                                to={item.to}
                                className={`hover:underline transition-colors ${item.isActive ? 'text-primary font-medium' : 'text-gray-600'
                                    }`}
                            >
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {item.label}
                            </Link>
                        ) : (
                            <span className={item.isActive ? 'text-primary font-medium' : ''}>
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && separator}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumbs;