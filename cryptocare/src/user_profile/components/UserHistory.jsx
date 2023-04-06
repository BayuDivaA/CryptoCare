import React from "react";
import { useTransactions } from "@usedapp/core";
import { shortenAddress2 } from "../../utils/shortenAddress";

export default function UserHistory() {
  const { transactions } = useTransactions();

  return (
    <>
      <div className="flex justify-center">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {transactions.length !== 0 && (
            <table className="w-full text-sm text-left text-gray-900 ">
              <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Block hash</th>
                  <th className="px-6 py-3">To</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  return (
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4">{transaction.transactionName}</td>
                      <td className="px-6 py-4">
                        <a className="hover:text-blue-300" href={"https://goerli-optimism.etherscan.io/tx/" + transaction.transaction.hash}>
                          {shortenAddress2(transaction.transaction.hash)}
                        </a>
                      </td>
                      <td className="px-6 py-4">{transaction.receipt.to}</td>
                      <td className="px-6 py-4">{new Date(transaction.submittedAt).toDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
