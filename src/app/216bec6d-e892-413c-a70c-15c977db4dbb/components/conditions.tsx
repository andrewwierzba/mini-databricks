interface ConditionProps {
    category?: string;
    description?: string;
    label: string;
    operator: "AND" | "OR";
    type: "sql" | "python";
    value: string;
}

export function Condition({
    category,
    description,
    label,
    operator,
    type,
    value
}: ConditionProps) {
    return (
        <div aria-label="condition">
            <span>{label}</span>
            {category &&
                <span
                    aria-label="category"
                    aria-hidden="true"
                    className="hidden"
                >
                    {category}
                </span>
            }
            {description && <span>{description}</span>}
            <span>{operator}</span>
            <span>{type}</span>
            <span>{value}</span>
        </div>
    );
}

interface Props {
    conditions: ConditionProps[];
}

export default function Conditions({ conditions }: Props) {
    return (
        <div>
            {conditions.map((condition) => (
                <Condition key={condition.label} {...condition} />
            ))}
        </div>
    );
}
