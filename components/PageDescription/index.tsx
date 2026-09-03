import styles from './styles.module.css';

export default function PageDescription({ content }: { content: string }): React.ReactElement {
  return (
    <div className={styles.container}>
      {content.split('\n').map((p: string) => (
        <p className={styles.paragraph} key={p} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </div>
  );
}
