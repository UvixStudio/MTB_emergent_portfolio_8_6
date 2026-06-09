/**
 * ChamferButton
 * Angled-corner button with top-right + bottom-left diagonal cuts.
 *
 * variant="solid"  → yellow fill, dark text (primary CTA)
 * variant="ghost"  → yellow stroke + yellow text, dark interior (secondary CTA)
 */

export default function ChamferButton({
    variant = "solid",
    children,
    className = "",
    as: Tag = "button",
    ...props
}) {
    if (variant === "ghost") {
        return (
            <Tag className={`btn-ghost-wrap ${className}`} {...props}>
                <span className="btn-ghost-inner">{children}</span>
            </Tag>
        );
    }

    return (
        <Tag className={`btn btn-solid ${className}`} {...props}>
            {children}
        </Tag>
    );
}
