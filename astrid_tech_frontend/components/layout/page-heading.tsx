import { FC, ReactNode } from "react";
import styles from "./page-heading.module.scss";

type PageHeadingProps = {
  title?: string;
  description?: ReactNode;
  textColor?: string;
  bgColor?: string;
  above?: ReactNode;
};

export const PageHeading: FC<PageHeadingProps> = ({
  title,
  description,
  bgColor,
  textColor,
  above,
}) => {
  return (
    <div style={{ backgroundColor: bgColor }}>
      <nav className={styles.above}>{above}</nav>
      <header className={styles.header}>
        {title ? (
          <h1 style={{ color: textColor }} className="p-name">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p style={{ color: textColor }} className="p-summary">
            {description}
          </p>
        ) : null}
      </header>
    </div>
  );
};
