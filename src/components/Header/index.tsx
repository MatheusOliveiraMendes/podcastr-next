import Image from "next/image";
import format from "date-fns/format";
import  ptBR  from "date-fns/locale/pt-BR";
import styles from "./styles.module.scss";

export function Header() {

    const currentDate = format(new Date(), 'EEEEEE, d MMM', {
        locale: ptBR,
    });

    return (
        <header className={styles.headerContainer}>
            <Image
                src="/logo.svg"
                alt="Podcastr"
                width={150}
                height={150}
            />


            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}