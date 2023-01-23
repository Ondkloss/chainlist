import * as React from "react";
import RPCList from "../RPCList";
import { renderProviderText } from "../../utils";
import { useRouter } from "next/router";
import Link from "next/link";
// import { useTranslations } from "next-intl";
import { notTranslation as useTranslations } from "../../utils";
import { useChain } from "../../stores";
import useAccount from "../../hooks/useAccount";
import useAddToNetwork from "../../hooks/useAddToNetwork";

export default function Chain({ chain, buttonOnly, lang }) {
  const t = useTranslations("Common", lang);

  const router = useRouter();

  const icon = React.useMemo(() => {
    return chain.chainSlug ? `https://icons.llamao.fi/icons/chains/rsz_${chain.chainSlug}.jpg` : "/unknown-logo.png";
  }, [chain]);

  const chainId = useChain((state) => state.id);
  const updateChain = useChain((state) => state.updateChain);

  const handleClick = () => {
    if (chain.chainId === chainId) {
      updateChain(null);
    } else {
      updateChain(chain.chainId);
    }
  };

  const showAddlInfo = chain.chainId === chainId;

  const { data: accountData } = useAccount();

  const address = accountData?.address ?? null;

  const { mutate: addToNetwork } = useAddToNetwork();

  if (!chain) {
    return <></>;
  }

  if (buttonOnly) {
    return (
      <button
        className="border dark:border-[#171717] border-[#EAEAEA] px-4 py-2 rounded-[50px] dark:text-[#093269] text-[#2F80ED] dark:hover:text-black hover:text-[#B3B3B3] dark:hover:bg-[#093269] hover:bg-[#2F80ED] w-fit mx-auto"
        onClick={() => addToNetwork({ address, chain })}
      >
        {t(renderProviderText(address))}
      </button>
    );
  }

  return (
    <>
      <div className="shadow dark:bg-black bg-[#B3B3B3] p-8 pb-0 rounded-[10px] flex flex-col gap-3 overflow-hidden" key={chain.chainId}>
        <Link href={`/chain/${chain.chainId}`} prefetch={false} className="flex items-center mx-auto gap-2">
          <img
            src={icon}
            width={26}
            height={26}
            className="rounded-full flex-shrink-0 flex relative"
            alt={chain.name + " logo"}
          />
          <span className="text-xl font-semibold [#B3B3B3]space-nowrap overflow-hidden text-ellipsis relative top-[1px]">
            {chain.name}
          </span>
        </Link>

        <table>
          <thead>
            <tr>
              <th className="font-normal text-gray-500">ChainID</th>
              <th className="font-normal text-gray-500">{t("currency")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center font-bold px-4">{chain.chainId}</td>
              <td className="text-center font-bold px-4">
                {chain.nativeCurrency ? chain.nativeCurrency.symbol : "none"}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          className="border dark:border-[#171717] border-[#EAEAEA] px-4 py-2 rounded-[50px] mb-auto dark:text-[#093269] text-[#2F80ED] dark:hover:text-black hover:text-[#B3B3B3] dark:hover:bg-[#093269] hover:bg-[#2F80ED] w-fit mx-auto"
          onClick={() => addToNetwork({ address, chain })}
        >
          {t(renderProviderText(address))}
        </button>

        {(lang === "en" ? router.pathname === "/" : router.pathname === "/zh") && (
          <button
            className="w-full rounded-[50px] p-2 flex items-center mb-2 justify-center dark:hover:bg-[#191919] hover:bg-[#f6f6f6]"
            onClick={handleClick}
          >
            <span className="sr-only">Show RPC List of {chain.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
              style={{
                transform: showAddlInfo ? "rotate(180deg)" : "",
                transition: "all 0.2s ease",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
      </div>

      {showAddlInfo && <RPCList chain={chain} lang={lang} />}
    </>
  );
}
