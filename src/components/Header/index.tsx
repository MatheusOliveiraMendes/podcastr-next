import Image from "next/image";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale/pt-BR";

export function Header() {

    const currentDate = format(new Date(), 'EEEEEE, d MMM', {
        locale: ptBR,
    });

    return (
        <header className="sticky top-0 z-30 flex h-[6.5rem] items-center gap-6 border-b border-white/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-12">
            <Image
                src="/logo.svg"
                alt="Podcastr"
                width={150}
                height={150}
            />


            <p className="hidden border-l border-gray-200 pl-6 text-sm text-gray-500 lg:block">
                O melhor para você ouvir, sempre
            </p>

            <span className="ml-auto text-sm font-medium capitalize text-gray-500">
                {currentDate}
            </span>
        </header>
    );
}
