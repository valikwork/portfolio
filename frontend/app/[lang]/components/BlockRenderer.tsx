export interface BlockNode {
  type: string;
  text?: string;
  children?: BlockNode[];
  level?: number;
  format?: string;
}

export const BlockRenderer = (props: { content: BlockNode[] }) => {
  const { content } = props;

  return content.map((block, index) => {
    if (block.type === "paragraph") {
      return (
        <p key={index} className="text-lg leading-relaxed">
          {block.children?.map((child, childIndex) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </p>
      );
    }

    if (block.type === "list") {
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      const listClass =
        block.format === "ordered"
          ? "list-decimal list-inside space-y-2 mb-4"
          : "list-disc list-inside space-y-2 mb-4";

      return (
        <ListTag key={index} className={listClass}>
          {block.children?.map((listItem, listItemIndex) => {
            if (listItem.type === "list-item") {
              return (
                <li key={listItemIndex} className="text-lg leading-relaxed">
                  {listItem.children?.map((child, childIndex) => (
                    <span key={childIndex}>{child.text}</span>
                  ))}
                </li>
              );
            }
            return null;
          })}
        </ListTag>
      );
    }

    if (block.type === "heading") {
      const level = block.level || 2;
      const headingClasses = "text-2xl font-bold mt-4 mb-2";
      const content = block.children?.map((child, childIndex) => (
        <span key={childIndex}>{child.text}</span>
      ));

      switch (level) {
        case 1:
          return (
            <h1 key={index} className={headingClasses}>
              {content}
            </h1>
          );
        case 2:
          return (
            <h2 key={index} className={headingClasses}>
              {content}
            </h2>
          );
        case 3:
          return (
            <h3 key={index} className={headingClasses}>
              {content}
            </h3>
          );
        case 4:
          return (
            <h4 key={index} className={headingClasses}>
              {content}
            </h4>
          );
        default:
          return (
            <h2 key={index} className={headingClasses}>
              {content}
            </h2>
          );
      }
    }
    return null;
  });
};
